import mongoose from 'mongoose';

const agreementSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // AGR-1234
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  carName: { type: String },
  weeklyRate: { type: Number, default: 45 },
  startDate: { type: String },
  endDate: { type: String },
  paidContributions: { type: Number, default: 0 },
  remainingMonths: { type: Number, default: 12 },
  depositStatus: { type: String, default: 'Pending' },
  insuranceCopyUrl: { type: String, default: null }
}, { timestamps: true });

agreementSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'AGR-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (!this.startDate) {
    this.startDate = new Date().toISOString().split('T')[0];
  }
  if (!this.endDate) {
    this.endDate = new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  next();
});

agreementSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Agreement = mongoose.models.Agreement || mongoose.model('Agreement', agreementSchema);
