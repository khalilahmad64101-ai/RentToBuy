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

// Always ensure virtuals or custom JSON mapping returns clean representations
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
