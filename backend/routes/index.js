const express = require('express')
const router = express.Router()
const authRoutes = require('./api/auth')
const { protect } = require('../middlewares/user')

router.use('/auth', authRoutes)

module.exports = router