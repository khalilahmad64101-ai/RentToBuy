import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  applicationId: { type: String, required: true },
  type: { type: String, required: true }, // 'reminder_1', 'reminder_2', 'reminder_3'
  scheduledFor: { type: Date, required: true },
  status: { type: String, default: 'Pending' } // 'Pending', 'Sent', 'Cancelled'
}, { timestamps: true });

export const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
