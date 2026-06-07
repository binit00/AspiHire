import Notification from '../models/Notification.js'

const toNotification = (notification) => ({
  id: notification._id.toString(),
  type: notification.type,
  title: notification.title,
  body: notification.body,
  relatedApplicationId: notification.relatedApplicationId?.toString(),
  read: notification.read,
  scheduledFor: notification.scheduledFor,
  createdAt: notification.createdAt?.toISOString(),
})

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ scheduledFor: -1 }).limit(50)
    res.json({ success: true, data: notifications.map(toNotification) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create({ user: req.user.id, ...req.body })
    res.status(201).json({ success: true, data: toNotification(notification) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: { read: true } },
      { new: true }
    )

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }

    res.json({ success: true, data: toNotification(notification) })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } })
    res.json({ success: true, data: { updated: true } })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}
