import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // EMAIL-1234
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  dateSent: { type: String },
  attachmentUrl: { type: String, default: null }
}, { timestamps: true });

emailSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'EMAIL-' + Date.now();
  }
  if (!this.dateSent) {
    this.dateSent = new Date().toISOString().split('T')[0];
  }
  next();
});

emailSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);
