import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // TXN-1234
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  date: { type: String },
  amount: { type: Number, required: true },
  method: { type: String, default: 'Debit Card' },
  status: { type: String, default: 'Successful' },
  carName: { type: String, default: 'Fleet Asset Dues' }
}, { timestamps: true });

paymentSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'TXN-' + Math.floor(1000 + Math.random() * 9000);
  }
  if (!this.date) {
    this.date = new Date().toISOString().split('T')[0];
  }
  next();
});

paymentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
