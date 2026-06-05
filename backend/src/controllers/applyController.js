import { 
  loadJson, 
  saveJson, 
  CARS_FILE, 
  APPLICATIONS_FILE, 
  AGREEMENTS_FILE, 
  PAYMENTS_FILE, 
  INQUIRIES_FILE,
  USERS_FILE
} from '../utils/storage.js';

export const createApplication = (req, res) => {
  const carsStore = loadJson(CARS_FILE, []);
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  const usersStore = loadJson(USERS_FILE, []);

  const { carId, userEmail, email, drivingLicence, selfieWithId, addressProof, durationMonths, applyDetails, profile } = req.body;
  const activeEmailVal = userEmail || email || (profile && profile.email);
  if (!activeEmailVal) {
    return res.status(400).json({ error: "Active identity credentials missing" });
  }

  const details = applyDetails || {};
  const drivingLicenceVal = drivingLicence || details.drivingLicence || "";
  const selfieWithIdVal = selfieWithId || details.selfieWithId || "";
  const addressProofVal = addressProof || details.addressProof || "";
  const durationMonthsVal = durationMonths || details.durationMonths || "12";

  const targetCar = carsStore.find(c => c.id === carId) || { name: "CUSTOM VEHICLE", model: "SPECIALIZED SPEC" };

  const finalEmail = activeEmailVal.toLowerCase().trim();
  const matchingUser = usersStore.find(u => u.email.toLowerCase() === finalEmail);
  const userId = matchingUser ? (matchingUser.id || matchingUser._id || matchingUser.email) : null;

  const currentFullName = profile?.fullName || details.fullName || (matchingUser?.fullName) || "";
  const currentPhone = profile?.phone || details.phone || (matchingUser?.phone) || "";
  const currentWeeklyIncome = Number(details.weeklyIncome) || 0;
  const currentEmployment = details.employment || "";
  const currentLocation = details.location || "";

  const newApp = {
    id: `APP-${Math.floor(Math.random() * 8999 + 1000)}`,
    userEmail: finalEmail,
    carId: carId,
    carName: `${targetCar.name} - ${targetCar.model}`,
    dateApplied: new Date().toISOString().split('T')[0],
    submissionDateTime: new Date().toISOString(),
    step: 1,
    status: "Pending", // Default is Pending
    creditCheckStatus: "PASSED (SOFT INCOME VERIFY)",
    userId: userId,
    fullName: currentFullName,
    phone: currentPhone,
    licenseFrontUrl: drivingLicenceVal,
    licenseBackUrl: addressProofVal,
    selfieUrl: selfieWithIdVal,
    applyDetails: {
      fullName: currentFullName,
      phone: currentPhone,
      employment: currentEmployment,
      weeklyIncome: currentWeeklyIncome,
      durationMonths: Number(durationMonthsVal),
      drivingLicence: drivingLicenceVal,
      addressProof: addressProofVal,
      selfieWithId: selfieWithIdVal,
      location: currentLocation
    }
  };

  applicationsStore.unshift(newApp);
  saveJson(APPLICATIONS_FILE, applicationsStore);
  res.status(201).json(newApp);
};

export const updateApplicationStep = (req, res) => {
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  const { id } = req.params;
  const { step } = req.body;
  
  const app = applicationsStore.find(a => a.id === id);
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

  saveJson(APPLICATIONS_FILE, applicationsStore);
  res.json({ message: `Successfully progressed application state to Stage ${targetStep}`, application: app });
};

export const updateApplicationDocuments = (req, res) => {
  const applicationsStore = loadJson(APPLICATIONS_FILE, []);
  const { id } = req.params;
  const { drivingLicence, selfieWithId, addressProof } = req.body;
  
  const app = applicationsStore.find(a => a.id === id);
  if (!app) {
    return res.status(404).json({ error: "Requested application not found" });
  }

  if (!app.applyDetails) {
    app.applyDetails = {};
  }

  if (drivingLicence !== undefined) app.applyDetails.drivingLicence = drivingLicence;
  if (selfieWithId !== undefined) app.applyDetails.selfieWithId = selfieWithId;
  if (addressProof !== undefined) app.applyDetails.addressProof = addressProof;

  saveJson(APPLICATIONS_FILE, applicationsStore);
  res.json({ message: "Documents successfully updated", application: app });
};

export const submitPayment = (req, res) => {
  const paymentsStore = loadJson(PAYMENTS_FILE, []);
  const agreementsStore = loadJson(AGREEMENTS_FILE, []);

  const { userEmail, email, amount, method, carName } = req.body;
  const activeEmailVal = userEmail || email;
  if (!activeEmailVal || !amount) {
    return res.status(400).json({ error: "Empty payment payload rejected" });
  }

  const activeEmail = activeEmailVal.toLowerCase();
  const newTxn = {
    id: `TXN-${Math.floor(Math.random() * 8999 + 1000)}`,
    userEmail: activeEmail,
    date: new Date().toISOString().split('T')[0],
    amount: Number(amount),
    method: method || "Debit Card",
    status: "Successful",
    carName: carName || "Fleet Asset Dues"
  };

  paymentsStore.unshift(newTxn);
  saveJson(PAYMENTS_FILE, paymentsStore);

  const agreement = agreementsStore.find(a => a.userEmail.toLowerCase() === activeEmail);
  if (agreement) {
    agreement.paidContributions = (agreement.paidContributions || 0) + Number(amount);
    saveJson(AGREEMENTS_FILE, agreementsStore);
  }

  res.status(201).json(newTxn);
};

export const submitInquiry = (req, res) => {
  const inquiriesStore = loadJson(INQUIRIES_FILE, []);
  const { name, email, msg } = req.body;
  if (!name || !email || !msg) {
    return res.status(400).json({ error: "Fill secure inquiry forms completely before submitting." });
  }

  const newInq = {
    id: `INQ-${Math.floor(Math.random() * 899 + 100)}`,
    name,
    email: email.toLowerCase(),
    msg,
    dateReceived: new Date().toISOString().split('T')[0],
    status: "Unread"
  };

  inquiriesStore.unshift(newInq);
  saveJson(INQUIRIES_FILE, inquiriesStore);
  res.status(201).json({ message: "Dispatch successful!", inquiry: newInq });
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
    console.log("[UPLOAD-DEBUG] Request headers:", req.headers);
    const files = req.files || {};
    const licenseFrontFile = files.licenseFront ? files.licenseFront[0] : null;
    const licenseBackFile = files.licenseBack ? files.licenseBack[0] : null;
    const proofOfAddressFile = files.proofOfAddress ? files.proofOfAddress[0] : null;
    
    console.log("[UPLOAD-DEBUG] Extracted front:", licenseFrontFile ? licenseFrontFile.filename : null);
    console.log("[UPLOAD-DEBUG] Extracted back:", licenseBackFile ? licenseBackFile.filename : null);
    console.log("[UPLOAD-DEBUG] Extracted selfie/proofOfAddress:", proofOfAddressFile ? proofOfAddressFile.filename : null);

    // Calculate the absolute base URL dynamically based on current requests headers (includes Nginx reverse proxies)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host') || 'localhost:3000';
    const baseUrl = `${protocol}://${host}`;

    // Return absolute URL paths served by static express static middleware of /uploads directory
    const licenseFrontUrl = licenseFrontFile 
      ? `${baseUrl}/uploads/${licenseFrontFile.filename}` 
      : "";
      
    const licenseBackUrl = licenseBackFile 
      ? `${baseUrl}/uploads/${licenseBackFile.filename}` 
      : "";
      
    const proofOfAddressUrl = proofOfAddressFile 
      ? `${baseUrl}/uploads/${proofOfAddressFile.filename}` 
      : "";
      
    const responsePayload = {
      licenseFront: licenseFrontUrl,
      licenseBack: licenseBackUrl,
      proofOfAddress: proofOfAddressUrl
    };

    console.log("[UPLOAD-DEBUG] Sending response payload:", responsePayload);
    res.json(responsePayload);
  } catch (error) {
    console.error("[UPLOAD-DEBUG] Error in uploadDocumentsMock real storage:", error);
    res.status(500).json({ error: "Failed to upload underwriting files perfectly." });
  }
};
