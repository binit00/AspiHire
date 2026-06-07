import mongoose from 'mongoose'

const NotificationSchema = new mongoose.Schema(
  {
    user:                 { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type:                 { type: String, enum: ['interview', 'reminder', 'offer', 'digest'], required: true },
    title:                { type: String, required: true, trim: true },
    body:                 { type: String, required: true, trim: true },
    relatedApplicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    read:                 { type: Boolean, default: false },
    scheduledFor:         { type: String, required: true },
  },
  { timestamps: true }
)

const Notification = mongoose.model('Notification', NotificationSchema)
export default Notification
