import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  id: { type: String, unique: true }, // INQ-123
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  msg: { type: String, required: true },
  dateReceived: { type: String },
  status: { type: String, default: 'Unread' }
}, { timestamps: true });

inquirySchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'INQ-' + Math.floor(100 + Math.random() * 899);
  }
  if (!this.dateReceived) {
    this.dateReceived = new Date().toISOString().split('T')[0];
  }
  next();
});

inquirySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
