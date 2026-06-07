import express from 'express'
import protect from '../middleware/auth.middleware.js'
import * as jobController from '../controllers/job.controller.js'

const router = express.Router()

// All job routes are protected
router.use(protect)

// GET    /api/jobs          — fetch all jobs for current user
router.get('/',     jobController.getJobs)

// GET    /api/jobs/stats    — aggregate stats for current user
router.get('/stats', jobController.getStats)

// POST   /api/jobs          — create a new job
router.post('/',    jobController.createJob)

// PUT    /api/jobs/:id      — update a job (status change, edit, etc.)
router.put('/:id',  jobController.updateJob)

// DELETE /api/jobs/:id      — delete a job
router.delete('/:id', jobController.deleteJob)

export default router
