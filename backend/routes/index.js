import express from 'express'
const router = express.Router()

import authRoutes from './api/auth.js'
import userRoutes from './api/customer/user.js'
import categoryRoutes from './api/category.js'
import brandRoutes from './api/brand.js'
import categoryRoutesAdmin from './api/admin/category.js'
import productRoutes from "./api/product.js"
import cartRoutes from './api/customer/cart.js'
import orderRoutes from './api/customer/order.js'
import paymentRoutes from './api/payment.js'
import paymentRoutesCustomer from './api/customer/payment.js'
import promotionRoutes from './api/customer/promotion.js'
import reviewRoutes from './api/review.js'
import reviewRoutesCustomer from './api/customer/review.js'
import wishlistRoutes from './api/customer/wishlist.js'
import feedbackRoutes from './api/customer/feedback.js'
import chatbotRoutes from './api/customer/chatbot.js'
import { protectCustomer, protectAdmin } from '../middlewares/user.js'
import brandRoutesAdmin from './api/admin/brand.js'
import productRoutesAdmin from './api/admin/product.js'
import adminRoutes from './api/admin/admin.js'
import orderRoutesAdmin from './api/admin/order.js'
import promotionRoutesAdmin from './api/admin/promotion.js'
import feedbackRoutesAdmin from './api/admin/feedback.js'
import reviewRoutesAdmin from './api/admin/review.js'
import paymentRoutesAdmin from './api/admin/payment.js'
import dashboard from './api/admin/dashboard.js'

router.use('/auth', authRoutes);
router.use('/users', protectCustomer, userRoutes)
router.use('/category', categoryRoutes)
router.use('/brand', brandRoutes)
router.use('/products', productRoutes)
router.use('/cart', protectCustomer, cartRoutes)
router.use('/order', protectCustomer, orderRoutes)
router.use('/payment', paymentRoutes)
router.use('/payment', protectCustomer, paymentRoutesCustomer)
router.use('/promotion', protectCustomer, promotionRoutes)
router.use('/review', reviewRoutes)
router.use('/review', protectCustomer, reviewRoutesCustomer)
router.use('/wishlist', protectCustomer, wishlistRoutes)
router.use('/feedback', protectCustomer, feedbackRoutes)
router.use('/chatbot', protectCustomer, chatbotRoutes)

router.use('/admin/product', protectAdmin, productRoutesAdmin);
router.use('/admin/category', protectAdmin, categoryRoutesAdmin);
router.use('/admin/brand', protectAdmin, brandRoutesAdmin);
router.use('/admin/user', protectAdmin, adminRoutes);
router.use('/admin/order', protectAdmin, orderRoutesAdmin);
router.use('/admin/promotion', protectAdmin, promotionRoutesAdmin);
router.use('/admin/feedback', protectAdmin, feedbackRoutesAdmin);
router.use('/admin/review', protectAdmin, reviewRoutesAdmin);
router.use('/admin/payment', protectAdmin, paymentRoutesAdmin);
router.use('/admin/dashboard', protectAdmin, dashboard);

export default router
