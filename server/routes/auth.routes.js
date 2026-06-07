import express from 'express'
import * as authController from '../controllers/auth.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', authController.register)

// POST /api/auth/login
router.post('/login', authController.login)

// GET /api/auth/me  (protected — add protect middleware when ready)
router.get('/me', protect, authController.getMe)

export default router
