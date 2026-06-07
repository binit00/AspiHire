import express from 'express'
import protect from '../middleware/auth.middleware.js'
import * as calendarController from '../controllers/calendar.controller.js'

const router = express.Router()

router.use(protect)
router.get('/events', calendarController.getEvents)
router.post('/create-event', calendarController.createEvent)

export default router
