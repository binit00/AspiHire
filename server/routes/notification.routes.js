import express from 'express'
import protect from '../middleware/auth.middleware.js'
import * as notificationController from '../controllers/notification.controller.js'

const router = express.Router()

router.use(protect)
router.get('/', notificationController.getNotifications)
router.post('/', notificationController.createNotification)
router.put('/:id/read', notificationController.markNotificationRead)
router.put('/read-all', notificationController.markAllNotificationsRead)

export default router
