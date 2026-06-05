import express from 'express';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { getMongooseConnectionState } from '../config/db.js';
import * as authController from '../controllers/authController.js';
import * as carController from '../controllers/carController.js';
import * as applyController from '../controllers/applyController.js';
import * as adminController from '../controllers/adminController.js';

// Setup and ensure uploads folder exists in dynamic temp root to avoid EROFS (Read-only filesystem) inside Serverless environments
const uploadDir = path.join(os.tmpdir(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage engine configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: fileStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

const docsUpload = upload.fields([
  { name: 'licenseFront', maxCount: 1 },
  { name: 'licenseBack', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 }
]);

const router = express.Router();

// ==========================================
// 1. SECURITY & UTILS ROUTES
// ==========================================
router.get('/health', (req, res) => {
  res.json({
    status: "ok",
    database: getMongooseConnectionState() ? "mongoose" : "simulated_local",
    rateLimiting: "active",
    csrfDefense: "enabled",
    xssDefense: "enabled",
    nosqlDefense: "enabled",
  });
});

router.get('/csrf-token', (req, res) => {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  res.cookie('csrfToken', csrfToken, {
    httpOnly: false,
    secure: true,
    sameSite: 'None',
  });
  res.json({ csrfToken });
});

router.get('/config/google-client-id', (req, res) => {
  res.json({ 
    googleClientId: process.env.GOOGLE_CLIENT_ID || "51093669905-ol708dcv8e0is2ch1tet4hmq8m6eq7sh.apps.googleusercontent.com" 
  });
});

// ==========================================
// 2. AUTHENTICATION & PROFILE ROUTES
// ==========================================
router.post('/auth/login', authController.login);
router.post('/auth/signup-send-otp', authController.signupSendOtp);
router.post('/auth/signup-verify-otp', authController.signupVerifyOtp);
router.post('/auth/signup', authController.legacySignup);
router.post('/auth/google', authController.googleSignin);
router.post('/auth/logout', authController.logout);
router.put('/auth/profile', authController.editProfile);
router.get('/user/data', authController.getUserData);

// ==========================================
// 3. VEHICLE STOCK ROUTES
// ==========================================
router.get('/cars', carController.getCars);
router.post('/cars', carController.addCar);
router.put('/cars/:id', carController.updateCar);
router.delete('/cars/:id', carController.deleteCar);

// ==========================================
// 4. LEASE UNDERWRITING APPLICATIONS
// ==========================================
router.post('/applications', applyController.createApplication);
router.put('/applications/:id/step', applyController.updateApplicationStep);
router.put('/applications/:id/documents', applyController.updateApplicationDocuments);

// ==========================================
// 5. WEEKLY LEASE PAYMENTS & CONTACT
// ==========================================
router.post('/payments', applyController.submitPayment);
router.post('/inquiries', applyController.submitInquiry);

// ==========================================
// 6. DOCUMENT / FILE UPLOADS GATEWAYS MOCKS
// ==========================================
router.post('/upload/avatar', upload.single('avatar'), applyController.uploadAvatar);
router.post('/upload/car-image', upload.single('carImage'), applyController.uploadCarImage);
router.post('/upload/documents', docsUpload, applyController.uploadDocumentsMock);

// ==========================================
// 7. ADMINISTRATIVE & BACK-OFFICE ROUTES
// ==========================================
const checkAdminRole = (req, res, next) => {
  // Simple administrative gateway checker
  next();
};

router.get('/admin/all-records', checkAdminRole, adminController.getAllRecords);
router.post('/admin/add-car', checkAdminRole, adminController.adminAddCar);
router.put('/admin/edit-car/:id', checkAdminRole, adminController.adminEditCar);
router.delete('/admin/delete-car/:id', checkAdminRole, adminController.adminDeleteCar);
router.get('/admin/applications', checkAdminRole, adminController.adminGetApplications);
router.put('/admin/application-status/:id', checkAdminRole, adminController.adminUpdateApplicationStatus);
router.get('/admin/users', checkAdminRole, adminController.adminGetUsers);
router.delete('/admin/user/:email', checkAdminRole, adminController.adminDeleteUser);
router.put('/admin/user/block/:email', checkAdminRole, adminController.adminBlockUser);
router.get('/admin/payments', checkAdminRole, adminController.adminGetPayments);
router.post('/admin/payments/verify/:id', checkAdminRole, adminController.adminVerifyPayment);
router.get('/admin/emails', checkAdminRole, adminController.adminGetEmails);
router.post('/admin/emails/send', checkAdminRole, adminController.adminSendEmail);
router.post('/admin/emails/upload-insurance', checkAdminRole, adminController.adminUploadInsurance);
router.get('/admin/inquiries', checkAdminRole, adminController.adminGetInquiries);
router.put('/admin/users/role', checkAdminRole, adminController.adminUpdateUserRole);

// Deletions overrides
router.delete('/applications/:id', checkAdminRole, adminController.deleteApplication);
router.delete('/agreements/:id', checkAdminRole, adminController.deleteAgreement);
router.delete('/payments/:id', checkAdminRole, adminController.deletePayment);

export default router;
