import express from 'express'
const router = express.Router();
import { addToCart, getCart, updateCartItem, removeCartItem } from '../../../controllers/customer/cartController.js'

router.post('/', addToCart);
router.get('/', getCart);
router.put('/', updateCartItem);
router.delete('/', removeCartItem);

export default router