import { User } from '../models/User.js';
import { Car } from '../models/Car.js';
import { Application } from '../models/Application.js';
import { Agreement } from '../models/Aggreement.js';
import { Payment } from '../models/Payment.js';
import { Inquiry } from '../models/Inquiry.js';
import { 
  sendApplicationSubmitted, 
  sendAdminNewApplicationAlert, 
  sendPaymentConfirmation, 
  sendAdminNewPaymentAlert, 
  sendAdminContactFormNotification,
  cancelReminders 
} from '../utils/notifier.js';

export const createApplication = async (req, res) => {
  try {
    const { carId, userEmail, email, drivingLicence, selfieWithId, addressProof, floorPlan, durationMonths, applyDetails, profile } = req.body;
    const activeEmailVal = userEmail || email || (profile && profile.email);
    if (!activeEmailVal) {
      return res.status(400).json({ error: "Active identity credentials missing" });
    }

    const details = applyDetails || {};
    const drivingLicenceVal = drivingLicence || details.drivingLicence || "";
    const selfieWithIdVal = selfieWithId || details.selfieWithId || "";
    const addressProofVal = addressProof || details.addressProof || "";
    const floorPlanVal = floorPlan || details.floorPlanUrl || details.floorPlan || "";
    const durationMonthsVal = durationMonths || details.durationMonths || "12";

    // Lookup original target vehicle specs in Mongoose
    const targetCar = (await Car.findOne({ id: carId })) || 
                      (await Car.findById(carId)) || 
                      { name: "CUSTOM VEHICLE", model: "SPECIALIZED SPEC" };

    const finalEmail = activeEmailVal.toLowerCase().trim();
    const matchingUser = await User.findOne({ email: finalEmail });
    const userId = matchingUser ? (matchingUser._id.toString()) : null;

    const currentFullName = profile?.fullName || details.fullName || (matchingUser?.fullName) || "";
    const currentPhone = profile?.phone || details.phone || (matchingUser?.phone) || "";
    const currentWeeklyIncome = Number(details.weeklyIncome) || 0;
    const currentEmployment = details.employment || "";
    const currentLocation = details.location || "";

    const newApp = new Application({
      userEmail: finalEmail,
      carId: carId,
      carName: `${targetCar.name} - ${targetCar.model}`,
      submissionDateTime: new Date(),
      step: 1,
      status: "Pending",
      creditCheckStatus: "PASSED (SOFT INCOME VERIFY)",
      userId: userId,
      fullName: currentFullName,
      phone: currentPhone,
      licenseFrontUrl: drivingLicenceVal,
      licenseBackUrl: addressProofVal,
      selfieUrl: selfieWithIdVal,
      floorPlanUrl: floorPlanVal,
      applyDetails: {
        fullName: currentFullName,
        phone: currentPhone,
        employment: currentEmployment,
        weeklyIncome: currentWeeklyIncome,
        durationMonths: Number(durationMonthsVal),
        drivingLicence: drivingLicenceVal,
        addressProof: addressProofVal,
        selfieWithId: selfieWithIdVal,
        location: currentLocation,
        floorPlanUrl: floorPlanVal
      }
    });

    await newApp.save();

    // Trigger Email Notifications (User Submission confirmation & Admin Alert)
    try {
      const formattedDate = newApp.submissionDateTime ? new Date(newApp.submissionDateTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      await sendApplicationSubmitted({
        to: finalEmail,
        userName: currentFullName,
        applicationId: newApp.id,
        submissionDate: formattedDate
      });
      await sendAdminNewApplicationAlert({
        adminEmail: process.env.ADMIN_EMAIL,
        userName: currentFullName,
        userEmail: finalEmail,
        userPhone: currentPhone,
        applicationId: newApp.id,
        submissionDate: formattedDate
      });
    } catch (emailErr) {
      console.error('[NOTIFIER WARNING] Failed to send application submission emails:', emailErr);
    }

    res.status(201).json(newApp);
  } catch (err) {
    console.error('[applyController] createApplication error:', err);
    res.status(500).json({ error: "Failed to persist new rent-to-own application record in MongoDB." });
  }
};

export const updateApplicationStep = async (req, res) => {
  try {
    const { id } = req.params;
    const { step } = req.body;
    
    const app = await Application.findOne({ id });
    if (!app) {
      return res.status(404).json({ error: "Requested underwriting folder index invalid" });
    }

    const targetStep = Number(step);
    app.step = targetStep;

    if (targetStep === 1) {
      app.status = "In Progress";
    } else if (targetStep === 2) {
      app.status = "Under Review";
    } else if (targetStep === 3) {
      app.status = "Action Required";
    } else if (targetStep === 4) {
      app.status = "Approved";
    }

    await app.save();
    res.json({ message: `Successfully progressed application state to Stage ${targetStep}`, application: app });
  } catch (err) {
    console.error('[applyController] updateApplicationStep error:', err);
    res.status(500).json({ error: "Failed to progress application state in MongoDB." });
  }
};

export const updateApplicationDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { drivingLicence, selfieWithId, addressProof } = req.body;
    
    const app = await Application.findOne({ id });
    if (!app) {
      return res.status(404).json({ error: "Requested application not found" });
    }

    if (!app.applyDetails) {
      app.applyDetails = {};
    }

    if (drivingLicence !== undefined) app.applyDetails.drivingLicence = drivingLicence;
    if (selfieWithId !== undefined) app.applyDetails.selfieWithId = selfieWithId;
    if (addressProof !== undefined) app.applyDetails.addressProof = addressProof;

    // Trigger Mongoose mixed type change notification
    app.markModified('applyDetails');
    await app.save();

    res.json({ message: "Documents successfully updated", application: app });
  } catch (err) {
    console.error('[applyController] updateApplicationDocuments error:', err);
    res.status(500).json({ error: "Failed to record uploaded document URL references in MongoDB." });
  }
};

export const submitPayment = async (req, res) => {
  try {
    const { userEmail, email, amount, method, carName } = req.body;
    const activeEmailVal = userEmail || email;
    if (!activeEmailVal || !amount) {
      return res.status(400).json({ error: "Empty payment payload rejected" });
    }

    const activeEmail = activeEmailVal.toLowerCase().trim();
    const newTxn = new Payment({
      userEmail: activeEmail,
      amount: Number(amount),
      method: method || "Debit Card",
      status: "Successful",
      carName: carName || "Fleet Asset Dues"
    });

    await newTxn.save();

    // Increment user active contribution ledger
    const agreement = await Agreement.findOne({ userEmail: activeEmail });
    if (agreement) {
      agreement.paidContributions = (agreement.paidContributions || 0) + Number(amount);
      await agreement.save();
    }

    // Trigger Email Notifications (User Receipt, Admin Alert, Stop Reminders)
    try {
      const matchingUser = await User.findOne({ email: activeEmail });
      const fullName = matchingUser ? matchingUser.fullName : "Lease Driver";
      const paymentDateVal = new Date().toISOString().split('T')[0];

      await sendPaymentConfirmation({
        to: activeEmail,
        userName: fullName,
        amount: Number(amount),
        carName: carName || "Fleet Asset Dues",
        paymentDate: paymentDateVal,
        method: method || "Debit Card",
        txnId: newTxn.id
      });

      await sendAdminNewPaymentAlert({
        adminEmail: process.env.ADMIN_EMAIL,
        userName: fullName,
        userEmail: activeEmail,
        paymentAmount: Number(amount),
        vehicleDetails: carName || "Fleet Asset Dues",
        paymentDate: paymentDateVal,
        method: method || "Debit Card",
        txnId: newTxn.id
      });

      // Stop any future reminders for this user
      await cancelReminders(activeEmail);
    } catch (emailErr) {
      console.error('[NOTIFIER WARNING] Failed to send payment confirmation emails:', emailErr);
    }

    res.status(201).json(newTxn);
  } catch (err) {
    console.error('[applyController] submitPayment error:', err);
    res.status(500).json({ error: "Failed to log weekly payment transaction onto MongoDB secure arrays." });
  }
};

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, msg } = req.body;
    if (!name || !email || !msg) {
      return res.status(400).json({ error: "Fill secure inquiry forms completely before submitting." });
    }

    const newInq = new Inquiry({
      name,
      email: email.toLowerCase().trim(),
      msg,
      status: "Unread"
    });

    await newInq.save();

    // Trigger Contact Inquiry Email Alert to Admin
    try {
      let phoneVal = "";
      let subjectVal = "Contact Inquiry";
      let bodyText = msg;

      const subjectMatch = msg.match(/Subject:\s*(.*)/i);
      const phoneMatch = msg.match(/Phone:\s*(.*)/i);
      const messageMatch = msg.match(/Message:\s*\n([\s\S]*)/i);

      if (subjectMatch) subjectVal = subjectMatch[1].trim();
      if (phoneMatch) phoneVal = phoneMatch[1].trim();
      if (messageMatch) bodyText = messageMatch[1].trim();

      await sendAdminContactFormNotification({
        adminEmail: process.env.ADMIN_EMAIL,
        name,
        email: email.toLowerCase().trim(),
        phone: phoneVal,
        subject: subjectVal,
        msg: bodyText,
        submissionDate: new Date().toISOString().split('T')[0]
      });
    } catch (emailErr) {
      console.error('[NOTIFIER WARNING] Failed to send admin contact alert email:', emailErr);
    }

    res.status(201).json({ message: "Dispatch successful!", inquiry: newInq });
  } catch (err) {
    console.error('[applyController] submitInquiry error:', err);
    res.status(500).json({ error: "Failed to lodge client enquiry into MongoDB." });
  }
};

export const uploadAvatar = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No avatar file uploaded." });
    }
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Failed to upload avatar." });
  }
};

export const uploadCarImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No carImage file uploaded." });
    }
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;
    res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Car image upload error:", error);
    res.status(500).json({ error: "Failed to upload car image." });
  }
};

export const uploadDocumentsMock = (req, res) => {
  try {
    console.log("[UPLOAD-DEBUG] Called uploadDocumentsMock. Files of request:", req.files);
    const files = req.files || {};
    const licenseFrontFile = files.licenseFront ? files.licenseFront[0] : null;
    const licenseBackFile = files.licenseBack ? files.licenseBack[0] : null;
    const proofOfAddressFile = files.proofOfAddress ? files.proofOfAddress[0] : null;
    const floorPlanFile = files.floorPlan ? files.floorPlan[0] : null;

    // Calculate the absolute base URL dynamically based on current requests headers
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    const licenseFrontUrl = licenseFrontFile 
      ? `${baseUrl}/uploads/${licenseFrontFile.filename}` 
      : "";
      
    const licenseBackUrl = licenseBackFile 
      ? `${baseUrl}/uploads/${licenseBackFile.filename}` 
      : "";
      
    const proofOfAddressUrl = proofOfAddressFile 
      ? `${baseUrl}/uploads/${proofOfAddressFile.filename}` 
      : "";

    const floorPlanUrl = floorPlanFile 
      ? `${baseUrl}/uploads/${floorPlanFile.filename}` 
      : "";
      
    const responsePayload = {
      licenseFront: licenseFrontUrl,
      licenseBack: licenseBackUrl,
      proofOfAddress: proofOfAddressUrl,
      floorPlan: floorPlanUrl
    };

    console.log("[UPLOAD-DEBUG] Sending response payload:", responsePayload);
    res.json(responsePayload);
  } catch (error) {
    console.error("[UPLOAD-DEBUG] Error in uploadDocumentsMock real storage:", error);
    res.status(500).json({ error: "Failed to upload underwriting files perfectly." });
  }
};
