import express from 'express'
const router = express.Router()
import { getPromotionByCode } from '../../../controllers/customer/promotionController.js'

router.get('/:code', getPromotionByCode)

export default router