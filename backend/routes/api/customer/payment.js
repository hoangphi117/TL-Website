import express from 'express'
const router = express.Router()
import { createPayment } from '../../../controllers/customer/paymentController.js'

router.post('/', createPayment)

export default router