import nodemailer from "nodemailer";
import { Email } from "../models/Email.js";
import { Agreement } from "../models/Aggreement.js";
import { Payment } from "../models/Payment.js";
import { Application } from "../models/Application.js";
import { Reminder } from "../models/Reminder.js";

// Helper to sanitize env variable string values (trim spaces and surrounding quotes)
const sanitizeEnv = (val) => {
  if (!val) return "";
  return String(val).trim().replace(/^['"]|['"]$/g, "").trim();
};

// Lazy initialize transport to capture env vars properly with production-ready timeouts
let transporter = null;

function getTransporter() {
  if (!transporter) {
    const user = sanitizeEnv(process.env.BREVO_SMTP_USER || process.env.EMAIL_USER);
    const pass = sanitizeEnv(process.env.BREVO_SMTP_PASSWORD || process.env.EMAIL_PASS);
    const host = sanitizeEnv(process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com');
    const port = Number(sanitizeEnv(process.env.BREVO_SMTP_PORT)) || 587;

    if (user && pass) {
      console.log(`[SMTP] Initializing Brevo SMTP relay connection (${host}:${port}) with user ${user}`);
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
          user,
          pass,
        },
        connectionTimeout: 30000, // 30 seconds connection timeout
        greetingTimeout: 30000,   // 30 seconds greeting timeout
        socketTimeout: 30000,     // 30 seconds socket timeout
      });
    } else {
      console.warn("[SMTP WATCH] Brevo SMTP credentials not found or empty. Mails will be simulated and logged in DB.");
    }
  }
  return transporter;
}

/**
 * Service Connection Verification on startup
 */
export async function verifySMTPOnStartup() {
  const user = sanitizeEnv(process.env.BREVO_SMTP_USER || process.env.EMAIL_USER);
  const pass = sanitizeEnv(process.env.BREVO_SMTP_PASSWORD || process.env.EMAIL_PASS);
  const host = sanitizeEnv(process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com');
  const port = Number(sanitizeEnv(process.env.BREVO_SMTP_PORT)) || 587;

  console.log(`\n======================================================`);
  console.log(`📡 [SMTP STARTUP VERIFICATION] Init check...`);
  console.log(`   Host: ${host}`);
  console.log(`   Port: ${port}`);
  console.log(`   Secure: ${port === 465}`);
  console.log(`   Auth User: ${user || "Not configured"}`);
  console.log(`======================================================`);

  if (!user || !pass) {
    console.warn("⚠️ [SMTP STARTUP WARNING] No SMTP auth credentials configured. Moving into Simulation mode.");
    console.log(`======================================================\n`);
    return false;
  }

  const client = getTransporter();
  if (!client) {
    console.warn("⚠️ [SMTP STARTUP WARNING] Transporter failed to initialize. Simulation fallback active.");
    console.log(`======================================================\n`);
    return false;
  }

  try {
    console.log("[SMTP STARTUP] Testing connection verify with standard server limits...");
    await client.verify();
    console.log("✅ [SMTP STARTUP SUCCESS] Nodemailer transporter verified successfully! Channels operational.");
    console.log(`======================================================\n`);
    return true;
  } catch (err) {
    console.error("❌ [SMTP STARTUP FAILURE] Nodemailer verify test threw an exception:");
    console.error(`   Error code: ${err.code}`);
    console.error(`   Message: ${err.message}`);
    console.error(`   Details:`, err);
    console.log(`======================================================\n`);
    return false;
  }
}

/**
 * Highly robust sendMail with custom linear backoff retry mechanism (max 3 attempts)
 */
async function sendMailWithRetry(client, mailOptions, maxRetries = 3, initialDelay = 1000) {
  let attempt = 0;
  while (attempt < maxRetries) {
    attempt++;
    try {
      console.log(`[SMTP] Attempt ${attempt} of ${maxRetries} to send email...`);
      const info = await client.sendMail(mailOptions);
      if (!info) {
        throw new Error("sendMail returned invalid response or empty payload");
      }
      return info; // Return success immediately
    } catch (err) {
      console.error(`[SMTP ATTEMPT ${attempt} FAILED] Error:`, err.message || err);
      if (attempt >= maxRetries) {
        throw err; // Re-throw the error on the final attempt
      }
      const waitTime = initialDelay * attempt;
      console.log(`[SMTP] Waiting ${waitTime}ms before retrying next attempt...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Sends a generic HTML/text email using Brevo SMTP and keeps database logs in Email collection.
 */
export async function sendEmailDirect({ to, subject, html, text, allowDuplicates = false }) {
  const sender = sanitizeEnv(process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER) || "noreply@rent2buy.com";
  const userEmail = to.toLowerCase().trim();

  // Prevent duplicate email sending for static notifications (non-payment, non-admin)
  if (!allowDuplicates) {
    try {
      const alreadySent = await Email.findOne({ userEmail, subject });
      if (alreadySent) {
        console.log(`[SMTP DUPLICATE DETECTED] Email with subject "${subject}" already delivered to ${userEmail}. Suppressing send to prevent spam duplicates.`);
        return { message: "Duplicate suppressed", suppressed: true };
      }
    } catch (err) {
      console.error("[SMTP DUPLICATE CHECK WARNING] Failed to search for duplicate logs, continuing:", err);
    }
  }

  // Strip HTML to save plain text log to our central DB
  const logContent = text || html.replace(/<[^>]*>/g, '').trim();
  
  try {
    const dbEmail = new Email({
      userEmail,
      subject,
      content: logContent,
    });
    await dbEmail.save();
    console.log(`[DB LOG] Successfully saved copy of email to ${userEmail} in MongoDB.`);
  } catch (err) {
    console.error("[DB ERROR] Failed to save copy of email to MongoDB log collection:", err);
  }

  const client = getTransporter();
  if (client) {
    try {
      // Use retry mechanism with custom high-standard logging
      const info = await sendMailWithRetry(client, {
        from: `"Rent2Buy Support" <${sender}>`,
        to: userEmail,
        subject,
        html,
        text: text || logContent,
      });
      console.log(`[SMTP] Email successfully delivered to ${userEmail}. MessageID: ${info.messageId}`);
      return info;
    } catch (err) {
      console.error(`[SMTP ERROR] All delivery attempts failed. Failed to send email to ${userEmail}:`, err);
      throw err; // Re-throw so caller acts correctly
    }
  } else {
    console.log(`[SMTP SIMULATION] Mail printed for ${userEmail}:\nSubject: ${subject}\nBody preview: ${logContent.substring(0, 150)}...`);
    return { message: "Simulation success", simulated: true };
  }
}

/**
 * Wrap content block with visual styling, company branding, and mobile-responsive container.
 */
function getHTMLTemplate(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
      color: #334155;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #edf2f7;
      padding: 20px 0;
      width: 100%;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #080B12;
      padding: 30px 20px;
      text-align: center;
      border-bottom: 3px solid #CDA275;
    }
    .header h1 {
      color: #CDA275;
      font-size: 24px;
      margin: 0;
      font-weight: 800;
      letter-spacing: 3px;
    }
    .header p {
      color: #94a3b8;
      font-size: 11px;
      margin: 5px 0 0 0;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .content {
      padding: 35px 25px;
    }
    .content h2 {
      color: #0d1e3d;
      font-size: 20px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 12px;
    }
    .content p {
      font-size: 15px;
      line-height: 1.6;
      color: #475569;
      margin: 0 0 16px 0;
    }
    .details-box {
      background-color: #f1f5f9;
      border-left: 4px solid #CDA275;
      padding: 18px;
      border-radius: 0 8px 8px 0;
      margin: 20px 0 25px 0;
    }
    .details-box table {
      width: 100%;
      border-collapse: collapse;
    }
    .details-box td {
      padding: 5px 0;
      font-size: 13.5px;
      vertical-align: top;
    }
    .details-box td.label {
      color: #64748b;
      font-weight: 600;
      width: 38%;
    }
    .details-box td.value {
      color: #0f172a;
      font-weight: 700;
    }
    .btn {
      display: inline-block;
      background-color: #CDA275;
      color: #080B12 !important;
      text-decoration: none;
      font-weight: 800;
      font-size: 13px;
      padding: 12px 25px;
      border-radius: 8px;
      text-align: center;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin: 15px 0;
    }
    .btn:hover {
      background-color: #b38b5f;
    }
    .footer {
      background-color: #080B12;
      padding: 25px 20px;
      text-align: center;
      font-size: 11.5px;
      color: #64748b;
      border-top: 1px solid #1e293b;
    }
    .footer a {
      color: #CDA275;
      text-decoration: none;
      font-weight: 600;
    }
    .footer p {
      margin: 4px 0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>RENT2BUY</h1>
        <p>HEATHROW DISPATCH - PREMIUM EV SOLUTIONS</p>
      </div>
      <div class="content">
        ${bodyHtml}
      </div>
      <div class="footer">
        <p>&copy; 2026 Rent2Buy Manchester &amp; London Heathrow. All Rights Reserved.</p>
        <p>Support coordinates: <a href="mailto:info@r2buy.com">info@r2buy.com</a> or call +44 (0)161 368 9635</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/* ==========================================
 * USER EMAIL NOTIFICATIONS
 * ========================================== */

/**
 * 1. Application Submitted confirmation
 */
export async function sendApplicationSubmitted({ to, userName, applicationId, submissionDate, carName }) {
  const subject = `RENT2BUY: Underwriting File Received [ID: ${applicationId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>Application Received</h2>
    <p>Dear ${userName},</p>
    <p>Your application has been submitted successfully and is currently under review.</p>
    <p>Thank you for choosing Rent2Buy. Your underwriting credentials file and eligibility checks folder has been received successfully by our Heathrow administration database.</p>
    <p>Our leasing specialists are currently conducting a soft review of your driving history and proof of address certificates.</p>
    <div class="details-box">
      <table>
        <tr><td class="label">Application ID:</td><td class="value"><b>${applicationId}</b></td></tr>
        <tr><td class="label">Applicant Name:</td><td class="value">${userName}</td></tr>
        <tr><td class="label">Vehicle Name:</td><td class="value">${carName || 'Custom Vehicle Spec'}</td></tr>
        <tr><td class="label">Submission Date:</td><td class="value">${submissionDate}</td></tr>
        <tr><td class="label">Current Status:</td><td class="value"><span style="color:#d97706; font-weight: 800;">Pending</span></td></tr>
      </table>
    </div>
    <p><strong>Tracking Instructions:</strong></p>
    <p>You can track your application status anytime using our <a href="${process.env.APP_URL || 'https://r2buy.com'}/track-ride">Track Ride page</a> by entering your Application ID: <b>${applicationId}</b>.</p>
    <p>We process standard Heathrow driver dispatch clearance checks in <b>24 hours</b>. You will receive an automated follow-up notification as soon as verification completes.</p>
    <p>Best regards,<br/>The Underwriting Team</p>
  `);

  return sendEmailDirect({ to, subject, html });
}

/**
 * 2. Application Approved notification
 */
export async function sendApplicationApproved({ to, userName, applicationId, carName, weeklyRate }) {
  const subject = `RENT2BUY APPROVED: Secure Your Approved Vehicle [ID: ${applicationId}] - Next Steps!`;
  const html = getHTMLTemplate(subject, `
    <h2>Application APPROVED!</h2>
    <p>Dear ${userName},</p>
    <p style="font-weight: bold; font-size: 16px; color: #10b981;">Your application has been approved.</p>
    <p style="font-weight: bold; font-size: 16px; color: #0f172a;">Application ID: ${applicationId}</p>
    <br/>
    <p>Excellent news! We are delighted to inform you that your Rent-to-Buy lease vehicle application <b>${applicationId}</b> has cleared underwriting successfully and is now <b>APPROVED</b>!</p>
    <p>Your vehicle reservation is locked into our Heathrow dispatch lot. Please complete the following step to activate your motor insurance policies and release your driver card &amp; keys:</p>
    <div class="details-box">
      <table>
        <tr><td class="label">Lease Ticket ID:</td><td class="value">${applicationId}</td></tr>
        <tr><td class="label">Vehicle Allocation:</td><td class="value">${carName || 'Custom Vehicle Spec'}</td></tr>
        <tr><td class="label">Weekly Contribution:</td><td class="value">£${weeklyRate || '50.00'} / week</td></tr>
        <tr><td class="label">Deposit Amount:</td><td class="value">£250.00 (Refundable)</td></tr>
        <tr><td class="label">State:</td><td class="value" style="color:#10b981; font-weight:800;">Approved</td></tr>
      </table>
    </div>
    <h3>Essential Security Deposit Instructions:</h3>
    <p>To finalize collection logistics and generate your standard motor insurance certificate, you must submit your <b>refundable lease downpayment deposit of £250.00</b> now:</p>
    <ol style="color:#475569; font-size:14px; line-height:1.6; padding-left:20px;">
      <li>Log in to your private <b>Driver Portal</b>.</li>
      <li>Navigate to your <b>Payments</b> dashboard block.</li>
      <li>Submit the <b>Lease Deposit</b> invoice of £250.00.</li>
    </ol>
    <p>Once deposit clearing logs are entered, your London Heathrow queue keys pick-up pass will be generated instantly.</p>
    <p style="text-align: center;">
      <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn">Go to Portal &amp; Pay Deposit</a>
    </p>
  `);

  return sendEmailDirect({ to, subject, html });
}

/**
 * 2b. Application Awaiting Payment notification
 */
export async function sendApplicationAwaitingPayment({ to, userName, applicationId, carName, weeklyRate }) {
  const subject = `RENT2BUY APPROVED: Awaiting Payment [ID: ${applicationId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>Application APPROVED & Awaiting Payment!</h2>
    <p>Dear ${userName},</p>
    <p style="font-weight: bold; font-size: 16px; color: #d97706;">Your application is approved and awaiting payment.</p>
    <p style="font-weight: bold; font-size: 16px; color: #0f172a;">Application ID: ${applicationId}</p>
    <br/>
    <p>Excellent news! Your Rent-to-Buy lease vehicle application <b>${applicationId}</b> has been successfully approved by underwriting and is now <b>Awaiting Payment</b>.</p>
    <p>Your vehicle allocation is temporarily reserved. To release the vehicle and schedule collection, please complete your £250.00 refundable lease security deposit.</p>
    <div class="details-box">
      <table>
        <tr><td class="label">Lease Ticket ID:</td><td class="value">${applicationId}</td></tr>
        <tr><td class="label">Vehicle Allocation:</td><td class="value">${carName || 'Custom Vehicle Spec'}</td></tr>
        <tr><td class="label">Weekly Contribution:</td><td class="value">£${weeklyRate || '50.00'} / week</td></tr>
        <tr><td class="label">Deposit Amount:</td><td class="value">£250.00 (Refundable)</td></tr>
        <tr><td class="label">State:</td><td class="value" style="color:#d97706; font-weight:800;">Awaiting Payment</td></tr>
      </table>
    </div>
    <p style="text-align: center;">
      <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn">Go to Portal &amp; Pay Deposit</a>
    </p>
  `);

  return sendEmailDirect({ to, subject, html });
}

/**
 * 3. Application Rejected notification
 */
export async function sendApplicationRejected({ to, userName, applicationId, reason }) {
  const subject = `RENT2BUY: Lease Application Underwriting Status Update [ID: ${applicationId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>Application Review Decision</h2>
    <p>Dear ${userName},</p>
    <p style="font-weight: bold; font-size: 16px; color: #ef4444;">Your application has been rejected.</p>
    <p style="font-weight: bold; font-size: 16px; color: #0f172a;">Application ID: ${applicationId}</p>
    <br/>
    <p>Thank you for submitting your Rent-to-Buy lease underwriting folder to Rent2Buy. Our specialists have audited your driver verification credentials folders carefully.</p>
    <p>We regret to inform you that we cannot approve your application and vehicle subscription booking at this time.</p>
    <div class="details-box" style="border-left-color: #ef4444; background-color: #fef2f2;">
      <strong style="color: #b91c1c; font-size: 14px; display: block; margin-bottom: 5px;">Decline Reference Reason:</strong>
      <p style="margin: 0; color: #4b5563; font-size: 13.5px; font-style: italic;">"${reason || 'The submitted address proof certificate did not clear verification checks or driver eligibility records failed to satisfy safety criteria.'}"</p>
    </div>
    <p>We encourage you to inspect your licenses profiles for typos, clear outstanding points, and re-submit a new underwriting application in the future when conditions change.</p>
    <p>Respectfully,<br/>The Verification Panel</p>
  `);

  return sendEmailDirect({ to, subject, html });
}

/**
 * 5. Payment Confirmation notification
 */
export async function sendPaymentConfirmation({ to, userName, amount, carName, paymentDate, method, txnId }) {
  const subject = `RENT2BUY RECEIPT: Contribution Payment Successful [Ref: ${txnId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>Payment Receipt Confirmation</h2>
    <p>Dear ${userName},</p>
    <p>Thank you for your transaction. Your payment has been successfully cleared and credited onto our Heathrow driver balance ledger lists:</p>
    <div class="details-box" style="border-left-color: #10b981;">
      <table>
        <tr><td class="label">Transaction ID:</td><td class="value">${txnId}</td></tr>
        <tr><td class="label">Vehicle/Asset:</td><td class="value">${carName || 'Fleet Lease Asset'}</td></tr>
        <tr><td class="label">Cleared Amount:</td><td class="value">£${amount}</td></tr>
        <tr><td class="label">Cleared Date:</td><td class="value">${paymentDate}</td></tr>
        <tr><td class="label">Billing Method:</td><td class="value">${method || 'Card Gateway'}</td></tr>
        <tr><td class="label">Transaction Status:</td><td class="value" style="color:#10b981; font-weight:850;">SUCCESSFUL</td></tr>
      </table>
    </div>
    <p>Your electronic ledger indices have updated in real time. We appreciate your prompt lease contributions.</p>
  `);

  return sendEmailDirect({ to, subject, html });
}


/* ==========================================
 * BOOKING EMAIL NOTIFICATIONS
 * ========================================== */

/**
 * 1. Booking Confirmation notification
 */
export async function sendBookingConfirmation({ to, userName, bookingId, carName, weeklyRate, bookingDate }) {
  const subject = `RENT2BUY CONTRACT: Lease Booking ${bookingId} Established!`;
  const html = getHTMLTemplate(subject, `
    <h2>Booking Registration Activated!</h2>
    <p>Dear ${userName},</p>
    <p>We are delighted to confirm that your rent-to-buy vehicle dispatch booking has been successfully established and locked into the Heathrow allocation registry!</p>
    <div class="details-box" style="border-left-color: #6366f1;">
      <table>
        <tr><td class="label">Contract ID:</td><td class="value">${bookingId}</td></tr>
        <tr><td class="label">Vehicle Specs:</td><td class="value">${carName || 'Premium EV Lineup'}</td></tr>
        <tr><td class="label">Weekly Rate:</td><td class="value">£${weeklyRate || '50.00'} / week</td></tr>
        <tr><td class="label">Registration Date:</td><td class="value">${bookingDate}</td></tr>
        <tr><td class="label">Registered User:</td><td class="value">${userName}</td></tr>
      </table>
    </div>
    <p>Your contract booking documents are prepared. Our technical mechanics are carrying out the complete Heathrow checklist pre-inspection prior to keys validation hand-off schedules.</p>
    <p>Please log in to your driver portal to track and download your paperwork at any time.</p>
  `);

  return sendEmailDirect({ to, subject, html });
}


/* ==========================================
 * ADMIN EMAIL NOTIFICATIONS
 * ========================================== */

/**
 * 1. New Application Alert for admin
 */
export async function sendAdminNewApplicationAlert({ adminEmail, userName, userEmail, userPhone, applicationId, submissionDate }) {
  const subject = `ADMIN ALERT: New Lease Application Submitted [ID: ${applicationId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>New Underwriting File Alert</h2>
    <p>Hello Administrator,</p>
    <p>An applicant has successfully submitted a new Rent-to-Own lease application underwriting folder on your public web portal:</p>
    <div class="details-box" style="border-left-color: #3b82f6;">
      <table>
        <tr><td class="label">Applicant Name:</td><td class="value">${userName}</td></tr>
        <tr><td class="label">Email Address:</td><td class="value">${userEmail}</td></tr>
        <tr><td class="label">Phone Contact:</td><td class="value">${userPhone || 'Not Specified'}</td></tr>
        <tr><td class="label">Application ticket:</td><td class="value">${applicationId}</td></tr>
        <tr><td class="label">Submission Date:</td><td class="value">${submissionDate}</td></tr>
      </table>
    </div>
    <p>Action requested: Please log in to your Administrative Panel to evaluate the drivers licensefront/back documents and proceed with processing (Approved/Rejected).</p>
    <p style="text-align: center;">
      <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn" style="background-color: #3b82f6; color:#ffffff !important;">Evaluate Application</a>
    </p>
  `);

  const dest = adminEmail || "khalilahmad64101@gmail.com";
  return sendEmailDirect({ to: dest, subject, html });
}

/**
 * 2. New Payment Alert for admin
 */
export async function sendAdminNewPaymentAlert({ adminEmail, userName, userEmail, paymentAmount, vehicleDetails, paymentDate, method, txnId }) {
  const subject = `ADMIN ALERT: Completed Transaction Logged [Amount: £${paymentAmount}] [Ref: ${txnId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>Payment Alert Received</h2>
    <p>Hello Administrator,</p>
    <p>This is to inform you that a client has completed an asset payment transaction successfully:</p>
    <div class="details-box" style="border-left-color: #10b981;">
      <table>
        <tr><td class="label">Driver Name:</td><td class="value">${userName}</td></tr>
        <tr><td class="label">Driver Email:</td><td class="value">${userEmail}</td></tr>
        <tr><td class="label">Cleared Amount:</td><td class="value">£${paymentAmount}</td></tr>
        <tr><td class="label">Transaction Date:</td><td class="value">${paymentDate}</td></tr>
        <tr><td class="label">Payment Type:</td><td class="value">${method || 'Debit Card'}</td></tr>
        <tr><td class="label">Transaction ID:</td><td class="value">${txnId}</td></tr>
        <tr><td class="label">Vehicle/Asset:</td><td class="value">${vehicleDetails || 'Dues contribution'}</td></tr>
      </table>
    </div>
    <p>The system has registered this transaction into MongoDB arrays. Let's inspect the administration dashboard list index for further details.</p>
  `);

  const dest = adminEmail || "khalilahmad64101@gmail.com";
  return sendEmailDirect({ to: dest, subject, html });
}

/**
 * 4. New Booking Alert for admin (booking creation)
 */
export async function sendAdminNewBookingAlert({ adminEmail, userName, userEmail, bookingId, carName, weeklyRate, bookingDate }) {
  const subject = `ADMIN ALERT: New Vehicle Lease Booking Created [Booking: ${bookingId}]`;
  const html = getHTMLTemplate(subject, `
    <h2>New Vehicle Lease Booking Established</h2>
    <p>Hello Administrator,</p>
    <p>A new booking contract registration has been successfully established and logged under our London Heathrow EV dispatch registry:</p>
    <div class="details-box" style="border-left-color: #6366f1;">
      <table>
        <tr><td class="label">Booking/Contract ID:</td><td class="value">${bookingId}</td></tr>
        <tr><td class="label">Vehicle Allocation:</td><td class="value">${carName || 'Premium EV Lineup'}</td></tr>
        <tr><td class="label">Weekly Rate:</td><td class="value">£${weeklyRate || '50.00'} / week</td></tr>
        <tr><td class="label">Driver Name:</td><td class="value">${userName}</td></tr>
        <tr><td class="label">Driver Email:</td><td class="value">${userEmail}</td></tr>
        <tr><td class="label">Registration Date:</td><td class="value">${bookingDate}</td></tr>
      </table>
    </div>
    <p>Please review active inventory logs or schedule the dispatch key prep workflow as needed.</p>
    <p style="text-align: center;">
      <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn" style="background-color: #6366f1; color:#ffffff !important;">View Bookings Portal</a>
    </p>
  `);

  const dest = adminEmail || "khalilahmad64101@gmail.com";
  return sendEmailDirect({ to: dest, subject, html });
}

/**
 * 3. Contact Form Submission alert for admin
 */
export async function sendAdminContactFormNotification({ adminEmail, name, email, phone, subject: userSubject, msg, submissionDate }) {
  const subject = `ADMIN CONTACT ALERT: Inquiry Received from ${name}`;
  const html = getHTMLTemplate(subject, `
    <h2>Help Request Submitted</h2>
    <p>Hello Administrator,</p>
    <p>A user has dispatched an enquiry through the public Contact Enquiry box form:</p>
    <div class="details-box" style="border-left-color: #f59e0b;">
      <table>
        <tr><td class="label">User Name:</td><td class="value">${name}</td></tr>
        <tr><td class="label">User Email:</td><td class="value">${email}</td></tr>
        <tr><td class="label">User Telephone:</td><td class="value">${phone || 'Not Supplied'}</td></tr>
        <tr><td class="label">Subject Line:</td><td class="value">${userSubject || 'General Inquiry'}</td></tr>
        <tr><td class="label">Submission Date:</td><td class="value">${submissionDate}</td></tr>
      </table>
    </div>
    <div style="background-color:#fee2e2; padding: 15px; border-radius: 8px; font-size: 14px; color:#1f2937; border:1px solid #fca5a5; margin-bottom: 20px;">
      <strong style="display:block; margin-bottom: 5px; color:#0f172a;">Message Narrative:</strong>
      <p style="margin:0; line-height: 1.5; white-space: pre-wrap;">${msg}</p>
    </div>
    <p>Please inspect logs or contact the sender at <b>${email}</b>.</p>
  `);

  const dest = adminEmail || "khalilahmad64101@gmail.com";
  return sendEmailDirect({ to: dest, subject, html });
}


/* ==========================================
 * PAYMENT REMINDER SYSTEM & SCHEDULER
 * ========================================== */

/**
 * Schedules three standard reminders when an application is approved.
 */
export async function scheduleReminders(userEmail, applicationId) {
  const emailQuery = userEmail.toLowerCase().trim();
  
  // Clear any existing reminders first to avoid duplicates
  await Reminder.deleteMany({ userEmail: emailQuery, applicationId, status: "Pending" });

  const times = [
    { type: 'reminder_1', offsetDays: 2 },
    { type: 'reminder_2', offsetDays: 4 },
    { type: 'reminder_3', offsetDays: 6 },
  ];

  for (const t of times) {
    const r = new Reminder({
      userEmail: emailQuery,
      applicationId,
      type: t.type,
      // Calculate scheduled time based on current time
      scheduledFor: new Date(Date.now() + t.offsetDays * 24 * 60 * 60 * 1000),
      status: 'Pending',
    });
    await r.save();
  }
  
  console.log(`[REMINDERS-DB] Successfully scheduled 3 reminders for approved application id ${applicationId} associated with ${emailQuery}`);
}

/**
 * Cancel all outstanding pending reminders for a user (e.g. because they paid).
 */
export async function cancelReminders(userEmail) {
  const emailQuery = userEmail.toLowerCase().trim();
  const result = await Reminder.updateMany(
    { userEmail: emailQuery, status: 'Pending' },
    { $set: { status: 'Cancelled' } }
  );
  console.log(`[REMINDERS-DB] Proactively cancelled all outstanding pending reminders for ${emailQuery}. Database matched: ${result.matchedCount}, updated: ${result.modifiedCount}`);
  return result;
}

/**
 * Processes due pending reminders (runs in cron loop).
 */
export async function processPendingReminders() {
  const now = new Date();
  
  // Find all pending reminders where scheduledFor <= now
  const dueReminders = await Reminder.find({
    status: 'Pending',
    scheduledFor: { $lte: now }
  });

  if (dueReminders.length === 0) return;

  console.log(`[SCHEDULER] Triggered check at ${now.toISOString()}. Found ${dueReminders.length} due reminders for evaluation.`);

  for (const r of dueReminders) {
    try {
      const emailQuery = r.userEmail.toLowerCase().trim();

      // Resolve whether user completed payment
      // A user is considered paid if their contract Agreement's depositStatus is Paid
      // OR if they made successful transactions
      const agr = await Agreement.findOne({ userEmail: emailQuery });
      const txns = await Payment.find({ userEmail: emailQuery, status: 'Successful' });
      
      const hasPaid = (agr && agr.depositStatus === 'Paid') || txns.length > 0;

      if (hasPaid) {
        // Cancel all future reminders for this user
        await Reminder.updateMany(
          { userEmail: emailQuery, status: 'Pending' },
          { $set: { status: 'Cancelled' } }
        );
        console.log(`[SCHEDULER] Aborted reminder ${r._id} for ${emailQuery} - payment confirmed. Future reminders cancelled.`);
        continue;
      }

      // Fetch user profile or application info
      const app = await Application.findOne({ id: r.applicationId });
      const fullName = app?.fullName || "Valued Custom Applicant";

      let subject = "";
      let html = "";

      if (r.type === 'reminder_1') {
        subject = `RENT2BUY REMINDER #1: Secure Your Approved Vehicle Booking Deposit!`;
        html = getHTMLTemplate(subject, `
          <h2>Lease Deposit Outstanding Dues (Reminder #1)</h2>
          <p>Dear ${fullName},</p>
          <p>We are writing to remind you that your Rent-to-Buy lease vehicle application remains <b>APPROVED</b> and cleared by underwriting. To avoid booking reservation expiration and release your vehicle keys, please clear your <b>refundable security deposit of £250.00</b>.</p>
          <div class="details-box">
            <table>
              <tr><td class="label">Application Ticket:</td><td class="value">${r.applicationId}</td></tr>
              <tr><td class="label">Required Deposit:</td><td class="value">£250.00</td></tr>
              <tr><td class="label">Time Status:</td><td class="value">2 Days Since Approval</td></tr>
              <tr><td class="label">Current Status:</td><td class="value" style="color:#d97706; font-weight:800;">Awaiting Payment</td></tr>
            </table>
          </div>
          <p>Please log in to your Driver Portal, open the <b>Payments</b> panel on your dashboard, and submit the £250.00 transaction dues to secure this stock vehicle before it is re-released to Heathrow driver lists queues.</p>
          <p style="text-align: center;">
            <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn">Go to Portal &amp; Pay Deposit</a>
          </p>
        `);
      } else if (r.type === 'reminder_2') {
        subject = `RENT2BUY REMINDER #2: Your Lease Stock Reservation Expires Soon`;
        html = getHTMLTemplate(subject, `
          <h2>Action Required: Pending Downpayment (Reminder #2)</h2>
          <p>Dear ${fullName},</p>
          <p>This is your second notification regarding the pending deposit on your approved Rent-to-Buy car lease (ID: ${r.applicationId}). Our Heathrow dispatch lot is receiving high driver volume, and we cannot guarantee your stock allocation much longer.</p>
          <div class="details-box" style="border-left-color:#f97316; background-color: #fffbeb;">
            <table>
              <tr><td class="label">Application Ticket:</td><td class="value">${r.applicationId}</td></tr>
              <tr><td class="label">Deposit Dues:</td><td class="value">£250.00</td></tr>
              <tr><td class="label">State:</td><td class="value" style="color:#f97316; font-weight:800;">48 Hours Remaining Before Lot Release</td></tr>
            </table>
          </div>
          <p>Access your driver dashboard payments gate today to finalize document coverage issues and register your EV. Completing payment instantly revokes any further notifications.</p>
          <p style="text-align: center;">
            <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn" style="background-color:#f97316;">Deposit Payment Gateway</a>
          </p>
        `);
      } else if (r.type === 'reminder_3') {
        subject = `LAST NOTICE: Approved Vehicle Lease Subscription Booking Cancelling`;
        html = getHTMLTemplate(subject, `
          <h2>FINAL NOTICE: Lease Agreement Deposit Dues (Reminder #3)</h2>
          <p>Dear ${fullName},</p>
          <p>This is the <b>FINAL</b> notification regarding your approved Rent-to-Buy underwriting file (ID: ${r.applicationId}). If your downpayment deposit dues are not cleared within the next 24 hours, your reservation will be <b>Cancelled</b> and your underwriting profile marked as <b>Expired</b>.</p>
          <div class="details-box" style="border-left-color:#ef4444; background-color:#fef2f2;">
            <table>
              <tr><td class="label">Application Ticket:</td><td class="value">${r.applicationId}</td></tr>
              <tr><td class="label">Deposit Amount:</td><td class="value">£250.00</td></tr>
              <tr><td class="label">Final Expiry:</td><td class="value" style="color:#ef4444; font-weight:800;">At midnight tonight</td></tr>
            </table>
          </div>
          <p>Please finalize payment immediately to protect your driving eligibility status rating. Click the button below to pay now.</p>
          <p style="text-align: center;">
            <a href="${process.env.APP_URL || 'https://r2buy.com'}/login" class="btn" style="background-color:#ef4444;">Final Clearance Gateway</a>
          </p>
        `);
      }

      await sendEmailDirect({
        to: emailQuery,
        subject,
        html,
      });

      r.status = 'Sent';
      await r.save();
      console.log(`[SCHEDULER] Successfully processed and sent ${r.type} to ${emailQuery}`);
    } catch (err) {
      console.error(`[SCHEDULER ERROR] Failed to perform single reminder checklist step for ${r._id}:`, err);
    }
  }
}

// Background Cron loop
let schedulerInterval = null;

export function startReminderScheduler() {
  if (schedulerInterval) return;

  console.log("[SCHEDULER] Activating lease payment notifications cron scheduler daemon...");
  
  // Set immediate trigger for fast sync on server initialization
  setTimeout(async () => {
    try {
      await processPendingReminders();
    } catch (err) {
      console.error("[SCHEDULER START ERROR] Failed initial reminders task hook:", err);
    }
  }, 10000); // 10 seconds post-boot

  schedulerInterval = setInterval(async () => {
    try {
      await processPendingReminders();
    } catch (err) {
      console.error("[SCHEDULER LOOP ERROR] Refreshed reminder daemon encountered runtime loop anomaly:", err);
    }
  }, 60 * 1000); // Check every 60 seconds
}
