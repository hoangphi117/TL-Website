import express from 'express'
const router = express.Router()
import { createFeedBack } from '../../../controllers/customer/feedbackController.js'

router.post('/', createFeedBack)

export default router