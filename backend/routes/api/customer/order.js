import express from 'express'
const router = express.Router()
import { createOrder, getOrderByCode, getOrdersUser, cancelOrder } from '../../../controllers/customer/orderController.js'

router.post('/', createOrder)
router.get('/:code', getOrderByCode)
router.get('/', getOrdersUser)
router.post('/:orderCode', cancelOrder)

export default router