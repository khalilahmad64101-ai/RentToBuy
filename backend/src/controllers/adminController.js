import { User } from '../models/User.js';
import { Car } from '../models/Car.js';
import { Application } from '../models/Application.js';
import { Agreement } from '../models/Agreement.js';
import { Payment } from '../models/Payment.js';
import { Email } from '../models/Email.js';
import { Inquiry } from '../models/Inquiry.js';

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
    const { name, model, price, deposit, description, year, fuel, transmission, mileage, image, images, status } = req.body;
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

    if (status) app.status = status;
    if (step) app.step = Number(step);
    if (documentChecks) app.documentChecks = documentChecks; 
    if (notes) app.notes = notes;

    if (status === "Approved" || Number(step) === 4) {
      app.status = "Approved";
      app.step = 4;
      
      const emailQuery = app.userEmail.toLowerCase().trim();
      const hasAgr = await Agreement.findOne({ userEmail: emailQuery });
      if (!hasAgr) {
        const parts = app.carName ? app.carName.split(" - ") : [];
        const newAgr = new Agreement({
          userEmail: emailQuery,
          carName: parts[0] || "TOYOTA PRIUS",
          weeklyRate: 45,
          depositStatus: "Pending", 
          insuranceCopyUrl: null
        });
        await newAgr.save();
      }

      const autoEmail = new Email({
        userEmail: emailQuery,
        subject: "HEATHROW INBOX: Rent-to-Own Application Approved!",
        content: `Dear Applicant, your driving credentials validation and Soft Credit review are complete. Your underwriting application status is APPROVED.\n\nDeposit requirement is activated. Please pay your refundable lease deposit of £150 in the driver portal to initiate EV key logistics delivery schedules. Your temporary motor cover documents will be generated within 1 hour.`,
        attachmentUrl: null
      });
      await autoEmail.save();
    }

    if (status === "Rejected") {
      const rejectEmail = new Email({
        userEmail: app.userEmail.toLowerCase().trim(),
        subject: "HEATHROW INBOX: Application Underwriting Status Update",
        content: `Dear Applicant, we regret to inform you that your rent-to-own lease folders has been declined due to driver eligibility credentials checks. Please cross check your driving history details and uploaded address proof files for precision.`,
        attachmentUrl: null
      });
      await rejectEmail.save();
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
