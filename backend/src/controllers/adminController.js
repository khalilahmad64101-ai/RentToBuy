import { 
  loadJson, 
  saveJson, 
  USERS_FILE, 
  APPLICATIONS_FILE, 
  AGREEMENTS_FILE, 
  PAYMENTS_FILE, 
  CARS_FILE, 
  EMAILS_FILE, 
  INQUIRIES_FILE 
} from '../utils/storage.js';

export const getAllRecords = (req, res) => {
  const usersStore = loadJson(USERS_FILE, []);
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  const agreementsStore = loadJson(AGREEMENTS_FILE, []);
  const paymentsStore = loadJson(PAYMENTS_FILE, []);
  const carsStore = loadJson(CARS_FILE, []);
  const emailsStore = loadJson(EMAILS_FILE, []);
  const inquiriesStore = loadJson(INQUIRIES_FILE, []);

  res.json({
    users: usersStore.map(u => ({ email: u.email, fullName: u.fullName, role: u.role, blocked: u.blocked || false })),
    applications: applicationsStore,
    agreements: agreementsStore,
    payments: paymentsStore,
    cars: carsStore,
    emails: emailsStore,
    inquiries: inquiriesStore
  });
};

export const adminAddCar = (req, res) => {
  const carsStore = loadJson(CARS_FILE, []);
  const { name, model, price, deposit, description, year, fuel, transmission, mileage, image, images, status } = req.body;
  if (!name || !model) {
    return res.status(400).json({ error: "Missing required vehicle make and model details." });
  }

  const newCar = {
    id: `car_${Date.now()}`,
    name: name.toUpperCase(),
    model: model.toUpperCase(),
    price: Number(price) || 45,
    weeklyRate: Number(price) || 45,
    deposit: Number(deposit) || 150,
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
  };

  carsStore.unshift(newCar);
  saveJson(CARS_FILE, carsStore);
  res.status(201).json({ message: "Stock EV added successfully!", car: newCar });
};

export const adminEditCar = (req, res) => {
  const carsStore = loadJson(CARS_FILE, []);
  const { id } = req.params;
  const idx = carsStore.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Vehicle listings index not matched." });
  }

  carsStore[idx] = { ...carsStore[idx], ...req.body };
  saveJson(CARS_FILE, carsStore);
  res.json({ message: "Vehicle specifications saved permanently!", car: carsStore[idx] });
};

export const adminDeleteCar = (req, res) => {
  let carsStore = loadJson(CARS_FILE, []);
  const { id } = req.params;
  const originalLen = carsStore.length;
  carsStore = carsStore.filter(c => c.id !== id);
  if (carsStore.length === originalLen) {
    return res.status(404).json({ error: "Vehicle index target invalid." });
  }
  saveJson(CARS_FILE, carsStore);
  res.json({ message: "Vehicle pruned from system listings database." });
};

export const adminGetApplications = (req, res) => {
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  res.json(applicationsStore);
};

export const adminUpdateApplicationStatus = (req, res) => {
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  const agreementsStore = loadJson(AGREEMENTS_FILE, []);
  const emailsStore = loadJson(EMAILS_FILE, []);
  
  const { id } = req.params;
  const { status, step, documentChecks, notes } = req.body;
  const app = applicationsStore.find(a => a.id === id);
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
    
    const hasAgr = agreementsStore.some(ag => ag.userEmail.toLowerCase() === app.userEmail.toLowerCase());
    if (!hasAgr) {
      const parts = app.carName.split(" - ");
      const newAgr = {
        id: `AGR-${Math.floor(Math.random() * 8999 + 1000)}`,
        userEmail: app.userEmail.toLowerCase(),
        carName: parts[0] || "TOYOTA PRIUS",
        weeklyRate: 45,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        paidContributions: 0,
        remainingMonths: 12,
        depositStatus: "Pending", 
        insuranceCopyUrl: null
      };
      agreementsStore.unshift(newAgr);
      saveJson(AGREEMENTS_FILE, agreementsStore);
    }

    const autoEmail = {
      id: `EMAIL-${Date.now()}`,
      userEmail: app.userEmail.toLowerCase(),
      subject: "HEATHROW INBOX: Rent-to-Own Application Approved!",
      content: `Dear Applicant, your driving credentials validation and Soft Credit review are complete. Your underwriting application status is APPROVED.\n\nDeposit requirement is activated. Please pay your refundable lease deposit of £150 in the driver portal to initiate EV key logistics delivery schedules. Your temporary motor cover documents will be generated within 1 hour.`,
      dateSent: new Date().toISOString().split('T')[0],
      attachmentUrl: null
    };
    emailsStore.unshift(autoEmail);
    saveJson(EMAILS_FILE, emailsStore);
  }

  if (status === "Rejected") {
    const rejectEmail = {
      id: `EMAIL-${Date.now()}`,
      userEmail: app.userEmail.toLowerCase(),
      subject: "HEATHROW INBOX: Application Underwriting Status Update",
      content: `Dear Applicant, we regret to inform you that your rent-to-own lease folders has been declined due to driver eligibility credentials checks. Please cross check your driving history details and uploaded address proof files for precision.`,
      dateSent: new Date().toISOString().split('T')[0],
      attachmentUrl: null
    };
    emailsStore.unshift(rejectEmail);
    saveJson(EMAILS_FILE, emailsStore);
  }

  saveJson(APPLICATIONS_FILE, applicationsStore);
  res.json({ message: "Underwriting status progressed successfully!", application: app });
};

export const adminGetUsers = (req, res) => {
  const usersStore = loadJson(USERS_FILE, []);
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  
  const activeUsersData = usersStore.map(u => {
    const appsCount = applicationsStore.filter(a => a.userEmail.toLowerCase() === u.email.toLowerCase()).length;
    return {
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      blocked: u.blocked || false,
      applicationsCount: appsCount
    };
  });
  res.json(activeUsersData);
};

export const adminDeleteUser = (req, res) => {
  let usersStore = loadJson(USERS_FILE, []);
  const { email } = req.params;
  const originalLen = usersStore.length;
  usersStore = usersStore.filter(u => u.email.toLowerCase() !== email.toLowerCase());
  if (usersStore.length === originalLen) {
    return res.status(404).json({ error: "User mismatch or not registered." });
  }
  saveJson(USERS_FILE, usersStore);
  res.json({ message: "Driver account profile permanent purged." });
};

export const adminBlockUser = (req, res) => {
  const usersStore = loadJson(USERS_FILE, []);
  const { email } = req.params;
  const { blocked } = req.body;
  const profile = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!profile) {
    return res.status(404).json({ error: "Driver profile mismatch." });
  }

  profile.blocked = blocked === true;
  saveJson(USERS_FILE, usersStore);
  res.json({ message: `Driver access ${profile.blocked ? 'SUSPENDED' : 'RESTORED'} successfully!`, user: profile });
};

export const adminGetPayments = (req, res) => {
  const paymentsStore = loadJson(PAYMENTS_FILE, []);
  res.json(paymentsStore);
};

export const adminVerifyPayment = (req, res) => {
  const paymentsStore = loadJson(PAYMENTS_FILE, []);
  const agreementsStore = loadJson(AGREEMENTS_FILE, []);
  
  const { id } = req.params;
  const tx = paymentsStore.find(p => p.id === id);
  if (!tx) {
    return res.status(404).json({ error: "Payment statement target missing." });
  }

  tx.status = "Successful";
  saveJson(PAYMENTS_FILE, paymentsStore);

  const agr = agreementsStore.find(a => a.userEmail.toLowerCase() === tx.userEmail.toLowerCase());
  if (agr) {
    agr.depositStatus = "Paid";
    agr.paidContributions = (agr.paidContributions || 0) + Number(tx.amount);
    saveJson(AGREEMENTS_FILE, agreementsStore);
  }

  res.json({ message: "Payment statement confirmed as Successful!", payment: tx });
};

export const adminGetEmails = (req, res) => {
  const emailsStore = loadJson(EMAILS_FILE, []);
  res.json(emailsStore);
};

export const adminSendEmail = (req, res) => {
  const emailsStore = loadJson(EMAILS_FILE, []);
  const { userEmail, subject, content, attachmentUrl } = req.body;
  if (!userEmail || !subject || !content) {
    return res.status(400).json({ error: "Email subject and target user details mandatory." });
  }

  const emailItem = {
    id: `EMAIL-${Date.now()}`,
    userEmail: userEmail.toLowerCase(),
    subject,
    content,
    dateSent: new Date().toISOString().split('T')[0],
    attachmentUrl: attachmentUrl || null
  };

  emailsStore.unshift(emailItem);
  saveJson(EMAILS_FILE, emailsStore);
  res.status(201).json({ message: "Administrative support message dispatched!", email: emailItem });
};

export const adminUploadInsurance = (req, res) => {
  const agreementsStore = loadJson(AGREEMENTS_FILE, []);
  const emailsStore = loadJson(EMAILS_FILE, []);
  
  const { userEmail, insuranceCopyUrl } = req.body;
  if (!userEmail) {
    return res.status(400).json({ error: "Target driver email not specified." });
  }

  const targetEmail = userEmail.toLowerCase();
  
  const agr = agreementsStore.find(a => a.userEmail.toLowerCase() === targetEmail);
  if (agr) {
    agr.insuranceCopyUrl = insuranceCopyUrl || "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800";
    saveJson(AGREEMENTS_FILE, agreementsStore);
  }

  const insuranceEmail = {
    id: `EMAIL-${Date.now()}`,
    userEmail: targetEmail,
    subject: "HEATHROW SECURITY: Motor Fleet Insurance Certificate Cover",
    content: "Please find attached your comprehensive motor fleet insurance certificate for your active rent-to-buy lease. Review high-visibility safety directives in case of physical breakdown cover callouts.",
    dateSent: new Date().toISOString().split('T')[0],
    attachmentUrl: insuranceCopyUrl || "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800"
  };

  emailsStore.unshift(insuranceEmail);
  saveJson(EMAILS_FILE, emailsStore);
  res.json({ message: "Motor insurance copy attached and support copy sent!", email: insuranceEmail });
};

export const adminGetInquiries = (req, res) => {
  const inquiriesStore = loadJson(INQUIRIES_FILE, []);
  res.json(inquiriesStore);
};

export const adminUpdateUserRole = (req, res) => {
  const usersStore = loadJson(USERS_FILE, []);
  const { email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: "Missing required parameters: email and role." });
  }

  const profile = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!profile) {
    return res.status(404).json({ error: "No user found with this email coordinates." });
  }

  profile.role = role;
  saveJson(USERS_FILE, usersStore);
  res.json({ message: `Successfully updated user role to ${role.toUpperCase()}`, user: profile });
};

export const deleteApplication = (req, res) => {
  let applicationsStore = loadJson(APPLICATIONS_FILE, []);
  const { id } = req.params;
  const originalLen = applicationsStore.length;
  applicationsStore = applicationsStore.filter(a => a.id !== id);
  if (applicationsStore.length === originalLen) {
    return res.status(404).json({ error: "Application records not found." });
  }
  saveJson(APPLICATIONS_FILE, applicationsStore);
  res.json({ message: "Lease application successfully deleted." });
};

export const deleteAgreement = (req, res) => {
  let agreementsStore = loadJson(AGREEMENTS_FILE, []);
  const { id } = req.params;
  const originalLen = agreementsStore.length;
  agreementsStore = agreementsStore.filter(a => a.id !== id);
  if (agreementsStore.length === originalLen) {
    return res.status(404).json({ error: "Lease contract agreement not found." });
  }
  saveJson(AGREEMENTS_FILE, agreementsStore);
  res.json({ message: "Lease contract agreement successfully truncated." });
};

export const deletePayment = (req, res) => {
  let paymentsStore = loadJson(PAYMENTS_FILE, []);
  const { id } = req.params;
  const originalLen = paymentsStore.length;
  paymentsStore = paymentsStore.filter(p => p.id !== id);
  if (paymentsStore.length === originalLen) {
    return res.status(404).json({ error: "Payment transaction block not found." });
  }
  saveJson(PAYMENTS_FILE, paymentsStore);
  res.json({ message: "Payment receipt statement permanent deleted." });
};
