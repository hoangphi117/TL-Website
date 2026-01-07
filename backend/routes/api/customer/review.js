import express from 'express'
const router = express.Router()
import { createReview } from '../../../controllers/customer/reviewController.js'

router.post('/', createReview)

export default router