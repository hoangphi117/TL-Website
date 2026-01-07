import express from 'express'
const router = express.Router()
import { getReviewsProduct } from '../../controllers/reviewController.js'

router.get('/:id', getReviewsProduct)

export default router