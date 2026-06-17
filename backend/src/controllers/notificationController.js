import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(451).json({ error: "Missing email parameter" });
    }
    const userEmail = email.toLowerCase().trim();
    const notifications = await Notification.find({ userEmail }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(notification);
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ error: "Failed to update notification" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Missing email parameter" });
    }
    const userEmail = email.toLowerCase().trim();
    await Notification.updateMany({ userEmail, read: false }, { read: true });
    res.json({ success: true, message: "All notifications marked as read." });
  } catch (err) {
    console.error("Error marking all notifications read:", err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
};
