import express from 'express'
import protect from '../middleware/auth.middleware.js'
import * as topicController from '../controllers/topic.controller.js'

const router = express.Router()

router.use(protect)
router.get('/', topicController.getTopics)
router.post('/', topicController.createTopic)
router.post('/bulk', topicController.bulkImportTopics)
router.put('/:id', topicController.updateTopic)

export default router
