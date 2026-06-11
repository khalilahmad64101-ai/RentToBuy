import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // APP-1234
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  carId: { type: String },
  carName: { type: String },
  dateApplied: { type: String },
  submissionDateTime: { type: Date, default: Date.now },
  step: { type: Number, default: 1 },
  status: { type: String, default: 'Pending' },
  creditCheckStatus: { type: String, default: 'PASSED (SOFT INCOME VERIFY)' },
  userId: { type: String },
  fullName: { type: String },
  phone: { type: String },
  licenseFrontUrl: { type: String },
  licenseBackUrl: { type: String },
  selfieUrl: { type: String },
  floorPlanUrl: { type: String },
  notes: { type: String, default: '' },
  documentChecks: { type: mongoose.Schema.Types.Mixed, default: {} },
  applyDetails: {
    fullName: { type: String },
    phone: { type: String },
    employment: { type: String },
    weeklyIncome: { type: Number, default: 0 },
    durationMonths: { type: Number, default: 12 },
    drivingLicence: { type: String },
    addressProof: { type: String },
    selfieWithId: { type: String },
    location: { type: String }
  }
}, { timestamps: true });

applicationSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'R2B-2026-' + Math.floor(100000 + Math.random() * 900000);
  }
  if (!this.dateApplied) {
    this.dateApplied = new Date().toISOString().split('T')[0];
  }
  next();
});

applicationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
