import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String, lowercase: true, trim: true, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'info', 'success', 'warning', 'error'
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
