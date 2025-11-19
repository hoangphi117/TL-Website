const express = require('express')
const router = express.Router()
const authRoutes = require('./api/auth')
const userRoutes = require('./api/customer/user')
const categoryController = require('./api/admin/category')
const { protectCustomer, protectAdmin } = require('../middlewares/user')

router.use('/auth', authRoutes)
router.use('/users', protectCustomer, userRoutes)
router.use('/category',protectAdmin,categoryController);

module.exports = router