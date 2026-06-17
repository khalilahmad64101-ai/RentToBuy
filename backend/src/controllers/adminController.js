import { User } from '../models/User.js';
import { Car } from '../models/Car.js';
import { Application } from '../models/Application.js';
import { Agreement } from '../models/Aggreement.js';
import { Payment } from '../models/Payment.js';
import { Email } from '../models/Email.js';
import { Inquiry } from '../models/Inquiry.js';
import { Notification } from '../models/Notification.js';
import { 
  sendApplicationApproved, 
  sendApplicationRejected, 
  sendApplicationAwaitingPayment,
  sendBookingConfirmation, 
  sendAdminNewBookingAlert,
  scheduleReminders 
} from '../utils/notifier.js';

export const getAllRecords = async (req, res) => {
  try {
    const usersStore = await User.find({});
    const applicationsStore = await Application.find({}).sort({ createdAt: -1 });
    const agreementsStore = await Agreement.find({}).sort({ createdAt: -1 });
    const paymentsStore = await Payment.find({}).sort({ createdAt: -1 });
    const carsStore = await Car.find({}).sort({ createdAt: -1 });
    const emailsStore = await Email.find({}).sort({ createdAt: -1 });
    const inquiriesStore = await Inquiry.find({}).sort({ createdAt: -1 });

    res.json({
      users: usersStore.map(u => ({ email: u.email, fullName: u.fullName, role: u.role, blocked: u.blocked || false })),
      applications: applicationsStore,
      agreements: agreementsStore,
      payments: paymentsStore,
      cars: carsStore,
      emails: emailsStore,
      inquiries: inquiriesStore
    });
  } catch (err) {
    console.error('[adminController] getAllRecords error:', err);
    res.status(500).json({ error: 'Failed to assemble centralized system dossiers from MongoDB clusters.' });
  }
};

export const adminAddCar = async (req, res) => {
  try {
    const { name, model, price, deposit, description, year, fuel, transmission, mileage, image, images, features, status } = req.body;
    if (!name || !model) {
      return res.status(400).json({ error: "Missing required vehicle make and model details." });
    }

    const newCar = new Car({
      name: name.toUpperCase(),
      model: model.toUpperCase(),
      price: Number(price) || 45,
      weeklyRate: Number(price) || 45,
      deposit: Number(deposit) || 150,
      depositAmount: Number(deposit) || 150,
      description: description || "Pristine EV vehicle ready for immediate active lease support.",
      year: year || "2024",
      fuel: fuel || "Petrol",
      transmission: transmission || "Manual",
      mileage: mileage || "18,000 miles",
      image: image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      images: Array.isArray(images) && images.length > 0 ? images : [
        image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800"
      ],
      features: Array.isArray(features) ? features : [],
      status: status || "Available"
    });

    await newCar.save();
    res.status(201).json({ message: "Stock EV added successfully!", car: newCar });
  } catch (err) {
    console.error('[adminController] adminAddCar error:', err);
    res.status(500).json({ error: "Failed to persist new stock EV into MongoDB secure arrays." });
  }
};

export const adminEditCar = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findOneAndUpdate(
      { $or: [{ id }, { _id: id }] },
      { $set: req.body },
      { new: true }
    );

    if (!car) {
      return res.status(404).json({ error: "Vehicle listings index not matched." });
    }

    res.json({ message: "Vehicle specifications saved permanently!", car });
  } catch (err) {
    console.error('[adminController] adminEditCar error:', err);
    res.status(500).json({ error: "Failed to save updated vehicle specs inside MongoDB." });
  }
};

export const adminDeleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    let deleted = await Car.findOneAndDelete({ id });
    if (!deleted) {
      deleted = await Car.findByIdAndDelete(id);
    }

    if (!deleted) {
      return res.status(404).json({ error: "Vehicle index target invalid." });
    }

    res.json({ message: "Vehicle pruned from system listings database." });
  } catch (err) {
    console.error('[adminController] adminDeleteCar error:', err);
    res.status(500).json({ error: "Failed to delete vehicle record from MongoDB." });
  }
};

export const adminGetApplications = async (req, res) => {
  try {
    const apps = await Application.find({}).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error('[adminController] adminGetApplications error:', err);
    res.status(500).json({ error: "Failed to retrieve drivers lease submissions from MongoDB." });
  }
};

export const adminUpdateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, step, documentChecks, notes } = req.body;
    
    const app = await Application.findOne({ id });
    if (!app) {
      return res.status(404).json({ error: "Underwriting folders index target invalid." });
    }

    const STAGES = [
      "Documents Uploaded",      // Step 1
      "Application Submitted",   // Step 2
      "Application Under Review",// Step 3
      "Approved",                // Step 4
      "Deposit Paid",            // Step 5
      "Insurance Uploaded",      // Step 6
      "Vehicle Ready",           // Step 7
      "Collection Scheduled"     // Step 8
    ];

    let targetStep = Number(step);
    let targetStatus = status;

    if (targetStep && !targetStatus) {
      const idx = targetStep - 1;
      if (idx >= 0 && idx < STAGES.length) {
        targetStatus = STAGES[idx];
      }
    } else if (targetStatus && !targetStep) {
      const idx = STAGES.indexOf(targetStatus);
      if (idx !== -1) {
        targetStep = idx + 1;
      }
    } else if (!targetStatus && !targetStep) {
      targetStatus = app.status;
      targetStep = app.step;
    }

    // Assign mapped values back to database document
    app.status = targetStatus;
    app.step = targetStep;

    if (documentChecks) app.documentChecks = documentChecks; 
    if (notes) app.notes = notes;

    const emailQuery = app.userEmail.toLowerCase().trim();

    // Trigger workflows for key stages
    if (targetStatus === "Approved" || targetStep === 4) {
      let targetAgr = await Agreement.findOne({ userEmail: emailQuery });
      if (!targetAgr) {
        const parts = app.carName ? app.carName.split(" - ") : [];
        targetAgr = new Agreement({
          userEmail: emailQuery,
          carName: parts[0] || "TOYOTA PRIUS",
          weeklyRate: 45,
          depositStatus: "Pending", 
          insuranceCopyUrl: null
        });
        await targetAgr.save();
      }

      const autoEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Rent-to-Own Application Approved!",
        content: `Dear Applicant, your driving credentials validation and Soft Credit review are complete. Your underwriting application status is APPROVED.\n\nDeposit requirement is activated. Please pay your refundable lease deposit of £250 in the driver portal to initiate EV key logistics delivery schedules. Your temporary motor cover documents will be generated within 1 hour.`,
        attachmentUrl: null
      });
      await autoEmail.save();

      // Save persistent user-facing notification in database
      try {
        const approvedNote = new Notification({
          userId: app.userId,
          userEmail: emailQuery,
          title: "Application Approved",
          content: "Your application has been approved. Please proceed with deposit payment.",
          type: "success"
        });
        await approvedNote.save();
      } catch (noteErr) {
        console.error("Failed to save Approved notification:", noteErr);
      }

      setImmediate(() => {
        const p1 = sendApplicationApproved({
          to: emailQuery,
          userName: app.fullName || "Lease Driver",
          applicationId: app.id,
          carName: app.carName || targetAgr.carName,
          weeklyRate: targetAgr.weeklyRate
        });

        const p2 = sendBookingConfirmation({
          to: emailQuery,
          userName: app.fullName || "Lease Driver",
          bookingId: targetAgr.id,
          carName: targetAgr.carName,
          weeklyRate: targetAgr.weeklyRate,
          bookingDate: new Date().toISOString().split('T')[0]
        });

        const p3 = sendAdminNewBookingAlert({
          adminEmail: process.env.ADMIN_EMAIL,
          userName: app.fullName || "Lease Driver",
          userEmail: emailQuery,
          bookingId: targetAgr.id,
          carName: targetAgr.carName,
          weeklyRate: targetAgr.weeklyRate,
          bookingDate: new Date().toISOString().split('T')[0]
        });

        Promise.all([p1, p2, p3])
          .then(() => console.log('[ADMIN-STATUS-FLOW] Email success: Approved & booking notifications delivered.'))
          .catch((emailErr) => console.error('[ADMIN-STATUS-FLOW] Email failed: Approved notifications failed:', emailErr));
      });
    }

    if (targetStatus === "Deposit Paid" || targetStep === 5) {
      let targetAgr = await Agreement.findOne({ userEmail: emailQuery });
      if (targetAgr) {
        targetAgr.depositStatus = "Paid";
        await targetAgr.save();
      }
      
      const confirmEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Refundable Lease Deposit Received",
        content: `Dear Applicant, we have processed and verified your refundable Rent-to-Buy lease deposit downpayment successfully. Your application status is updated to DEPOSIT PAID.\n\nYour temporary motor fleet cover documents are being prepared.`,
        attachmentUrl: null
      });
      await confirmEmail.save();

      // Save persistent user-facing notification in database
      try {
        const depositNote = new Notification({
          userId: app.userId,
          userEmail: emailQuery,
          title: "Deposit Paid",
          content: "Your deposit has been received successfully.",
          type: "success"
        });
        await depositNote.save();
      } catch (noteErr) {
        console.error("Failed to save Deposit Paid notification:", noteErr);
      }
    }

    if (targetStatus === "Insurance Uploaded" || targetStep === 6) {
      let targetAgr = await Agreement.findOne({ userEmail: emailQuery });
      if (targetAgr && !targetAgr.insuranceCopyUrl) {
        targetAgr.insuranceCopyUrl = "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800";
        await targetAgr.save();
      }

      const certEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Motor Fleet Insurance Cover Is Linked!",
        content: `Dear Applicant, your comprehensive driver motor cover policy is now live and linked to your contract dossier. Your status is updated to INSURANCE UPLOADED.\n\nOur team is finalizing your vehicle pre-dispatch checks.`,
        attachmentUrl: null
      });
      await certEmail.save();

      // Save persistent user-facing notification in database
      try {
        const docsNote = new Notification({
          userId: app.userId,
          userEmail: emailQuery,
          title: "Documents Approved",
          content: "Your documents have been approved.",
          type: "success"
        });
        await docsNote.save();
      } catch (noteErr) {
        console.error("Failed to save Documents Approved notification:", noteErr);
      }
    }

    if (targetStatus === "Vehicle Ready" || targetStep === 7) {
      const dispatchEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Vehicle Pre-Dispatch Check Complete",
        content: `Dear Applicant, your allocated vehicle has cleared our mechanical & cleanliness inspections successfully. The status is updated to VEHICLE READY.\n\nWe will schedule your London collection appointment shortly.`,
        attachmentUrl: null
      });
      await dispatchEmail.save();

      // Save persistent user-facing notification in database
      try {
        const readyNote = new Notification({
          userId: app.userId,
          userEmail: emailQuery,
          title: "Vehicle Ready",
          content: "Your vehicle is ready for collection.",
          type: "success"
        });
        await readyNote.save();
      } catch (noteErr) {
        console.error("Failed to save Vehicle Ready notification:", noteErr);
      }
    }

    if (targetStatus === "Collection Scheduled" || targetStep === 8) {
      const scheduleEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Delivery Key Hand-off Scheduled",
        content: `Dear Applicant, congratulations! Your vehicle collection appointment is finalized. Please check your workspace dashboard for date and collection instructions.\n\nLet's get you on the road!`,
        attachmentUrl: null
      });
      await scheduleEmail.save();

      // Save persistent user-facing notification in database
      try {
        const scheduleNote = new Notification({
          userId: app.userId,
          userEmail: emailQuery,
          title: "Collection Scheduled",
          content: "Your vehicle collection is scheduled. Please check pickup coordinates.",
          type: "success"
        });
        await scheduleNote.save();
      } catch (noteErr) {
        console.error("Failed to save Collection Scheduled notification:", noteErr);
      }
    }

    if (targetStatus === "Rejected") {
      const rejectEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Application Underwriting Status Update",
        content: `Dear Applicant, we regret to inform you that your rent-to-own lease folders has been declined due to driver eligibility credentials checks. Please cross check your driving history details and uploaded address proof files for precision.`,
        attachmentUrl: null
      });
      await rejectEmail.save();

      setImmediate(() => {
        sendApplicationRejected({
          to: emailQuery,
          userName: app.fullName || "Lease Driver",
          applicationId: app.id,
          reason: notes || app.notes
        })
        .then(() => console.log('[ADMIN-STATUS-FLOW] Email success: Rejection notification delivered.'))
        .catch((emailErr) => console.error('[ADMIN-STATUS-FLOW] Email failed: Rejection notification failed:', emailErr));
      });
    }

    if (status === "Awaiting Payment") {
      const awaitEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Application Approved - Awaiting Payment",
        content: `Dear Applicant, your driving credentials validation and Soft Credit review are complete. Your underwriting application status is APPROVED and currently AWAITING PAYMENT.\n\nDeposit requirement is activated. Please pay your refundable lease deposit of £250 in the driver portal to initiate EV key logistics delivery schedules.`,
        attachmentUrl: null
      });
      await awaitEmail.save();

      setImmediate(() => {
        const parts = app.carName ? app.carName.split(" - ") : [];
        sendApplicationAwaitingPayment({
          to: emailQuery,
          userName: app.fullName || "Lease Driver",
          applicationId: app.id,
          carName: app.carName || parts[0],
          weeklyRate: 45
        })
        .then(() => console.log('[ADMIN-STATUS-FLOW] Email success: Awaiting payment notification delivered.'))
        .catch((emailErr) => console.error('[ADMIN-STATUS-FLOW] Email failed: Awaiting payment notification failed:', emailErr));
      });
    }

    await app.save();
    res.json({ message: "Underwriting status progressed successfully!", application: app });
  } catch (err) {
    console.error('[adminController] adminUpdateApplicationStatus error:', err);
    res.status(500).json({ error: "Failed to log application status update inside MongoDB arrays." });
  }
};

export const adminGetUsers = async (req, res) => {
  try {
    const usersStore = await User.find({});
    
    const activeUsersData = [];
    for (const u of usersStore) {
      const appsCount = await Application.countDocuments({ userEmail: u.email.toLowerCase() });
      activeUsersData.push({
        fullName: u.fullName,
        email: u.email,
        role: u.role,
        blocked: u.blocked || false,
        applicationsCount: appsCount
      });
    }

    res.json(activeUsersData);
  } catch (err) {
    console.error('[adminController] adminGetUsers error:', err);
    res.status(500).json({ error: "Failed to aggregate driver list coordinates." });
  }
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const deleted = await User.findOneAndDelete({ email: email.toLowerCase().trim() });
    if (!deleted) {
      return res.status(404).json({ error: "User mismatch or not registered." });
    }

    res.json({ message: "Driver account profile permanent purged." });
  } catch (err) {
    console.error('[adminController] adminDeleteUser error:', err);
    res.status(500).json({ error: "Failed to purge driver account dossier from MongoDB." });
  }
};

export const adminBlockUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { blocked } = req.body;
    const profile = await User.findOne({ email: email.toLowerCase().trim() });
    if (!profile) {
      return res.status(404).json({ error: "Driver profile mismatch." });
    }

    profile.blocked = blocked === true;
    await profile.save();
    res.json({ message: `Driver access ${profile.blocked ? 'SUSPENDED' : 'RESTORED'} successfully!`, user: profile });
  } catch (err) {
    console.error('[adminController] adminBlockUser error:', err);
    res.status(500).json({ error: "Failed to commit driver access suspension settings." });
  }
};

export const adminGetPayments = async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('[adminController] adminGetPayments error:', err);
    res.status(500).json({ error: "Failed to retrieve weekly rent statements." });
  }
};

export const adminVerifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Payment.findOne({ id });
    if (!tx) {
      return res.status(404).json({ error: "Payment statement target missing." });
    }

    tx.status = "Successful";
    await tx.save();

    const emailQuery = tx.userEmail.toLowerCase().trim();
    const agr = await Agreement.findOne({ userEmail: emailQuery });
    if (agr) {
      agr.depositStatus = "Paid";
      // Ensure paidContributions is incremented safely
      agr.paidContributions = (agr.paidContributions || 0) + Number(tx.amount);
      await agr.save();
    }

    res.json({ message: "Payment statement confirmed as Successful!", payment: tx });
  } catch (err) {
    console.error('[adminController] adminVerifyPayment error:', err);
    res.status(500).json({ error: "Failed to audit/verify physical receipt statement inside MongoDB." });
  }
};

export const adminGetEmails = async (req, res) => {
  try {
    const emails = await Email.find({}).sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    console.error('[adminController] adminGetEmails error:', err);
    res.status(500).json({ error: "Failed to load support notifications registry from MongoDB." });
  }
};

export const adminSendEmail = async (req, res) => {
  try {
    const { userEmail, subject, content, attachmentUrl } = req.body;
    if (!userEmail || !subject || !content) {
      return res.status(400).json({ error: "Email subject and target user details mandatory." });
    }

    const emailItem = new Email({
      userEmail: userEmail.toLowerCase().trim(),
      subject,
      content,
      attachmentUrl: attachmentUrl || null
    });

    await emailItem.save();
    res.status(201).json({ message: "Administrative support message dispatched!", email: emailItem });
  } catch (err) {
    console.error('[adminController] adminSendEmail error:', err);
    res.status(500).json({ error: "Failed to lodge automated administrative dispatch blocks onto MongoDB." });
  }
};

export const adminUploadInsurance = async (req, res) => {
  try {
    const { userEmail, insuranceCopyUrl } = req.body;
    if (!userEmail) {
      return res.status(400).json({ error: "Target driver email not specified." });
    }

    const targetEmail = userEmail.toLowerCase().trim();
    
    const agr = await Agreement.findOne({ userEmail: targetEmail });
    if (agr) {
      agr.insuranceCopyUrl = insuranceCopyUrl || "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800";
      await agr.save();
    }

    const insuranceEmail = new Email({
      userEmail: targetEmail,
      subject: "HEATHROW SECURITY: Motor Fleet Insurance Certificate Cover",
      content: "Please find attached your comprehensive motor fleet insurance certificate for your active rent-to-buy lease. Review high-visibility safety directives in case of physical breakdown cover callouts.",
      attachmentUrl: insuranceCopyUrl || "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800"
    });

    await insuranceEmail.save();
    res.json({ message: "Motor insurance copy attached and support copy sent!", email: insuranceEmail });
  } catch (err) {
    console.error('[adminController] adminUploadInsurance error:', err);
    res.status(500).json({ error: "Failed to commit fleet insurance updates and dispatches." });
  }
};

export const adminGetInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (err) {
    console.error('[adminController] adminGetInquiries error:', err);
    res.status(500).json({ error: "Failed to aggregate homepage client inquiries in MongoDB." });
  }
};

export const adminUpdateUserRole = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ error: "Missing required parameters: email and role." });
    }

    const profile = await User.findOne({ email: email.toLowerCase().trim() });
    if (!profile) {
      return res.status(404).json({ error: "No user found with this email coordinates." });
    }

    profile.role = role;
    await profile.save();
    res.json({ message: `Successfully updated user role to ${role.toUpperCase()}`, user: profile });
  } catch (err) {
    console.error('[adminController] adminUpdateUserRole error:', err);
    res.status(500).json({ error: "Failed to update driver privileges settings in MongoDB." });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Application.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Application records not found." });
    }
    res.json({ message: "Lease application successfully deleted." });
  } catch (err) {
    console.error('[adminController] deleteApplication error:', err);
    res.status(500).json({ error: "Failed to truncate underwriting record from MongoDB." });
  }
};

export const deleteAgreement = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Agreement.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Lease contract agreement not found." });
    }
    res.json({ message: "Lease contract agreement successfully truncated." });
  } catch (err) {
    console.error('[adminController] deleteAgreement error:', err);
    res.status(500).json({ error: "Failed to truncate lease contract document from MongoDB." });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Payment.findOneAndDelete({ id });
    if (!deleted) {
      return res.status(404).json({ error: "Payment transaction block not found." });
    }
    res.json({ message: "Payment receipt statement permanent deleted." });
  } catch (err) {
    console.error('[adminController] deletePayment error:', err);
    res.status(500).json({ error: "Failed to delete payment transaction coordinates from MongoDB." });
  }
};

export const adminRunSMTPDiagnostics = async (req, res) => {
  try {
    const { runSmtpDiagnostics } = await import("../utils/smtpDiagnostic.js");
    const results = await runSmtpDiagnostics();
    res.json({
      success: true,
      message: "SMTP diagnostics channel audit successfully processed.",
      results
    });
  } catch (err) {
    console.error('[adminController] adminRunSMTPDiagnostics fatal error:', err);
    res.status(500).json({ 
      success: false, 
      error: "Diagnostics procedure failed with an unhandled exception.", 
      details: err.message 
    });
  }
};

