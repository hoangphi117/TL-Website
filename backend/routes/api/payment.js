import express from 'express';
const router = express.Router();
import { momo_return, vnpay_return } from '../../controllers/paymentController.js'

router.get('/vnpay_return', vnpay_return)

router.get('/momo_return', momo_return)


export default router;