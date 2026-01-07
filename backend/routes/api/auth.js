import express from 'express'
const router = express.Router()
import { registerCustomer, registerAdmin, loginCustomer, loginAdmin, createResetToken, resetPassword } from "../../controllers/authController.js"

router.post("/register/customer", registerCustomer)
router.post("/login/customer", loginCustomer)

router.post("/register/admin", registerAdmin)
router.post("/login/admin", loginAdmin)

router.post("/reset-password", createResetToken)
router.post("/reset-password/:token", resetPassword)

export default router