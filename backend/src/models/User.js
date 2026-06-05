import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  fullName: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  passwordHash: { type: String, required: true },
  blocked: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
