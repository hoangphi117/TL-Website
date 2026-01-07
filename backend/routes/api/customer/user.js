import express from 'express'
const router = express.Router()
import { changePassword, getMyProfile, updateMyProfile } from "../../../controllers/customer/userController.js"

router.post("/change-password", changePassword)
router.get("/me", getMyProfile)
router.put("/me", updateMyProfile)

export default router