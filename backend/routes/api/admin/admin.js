import express from 'express';

const router = express.Router();
import { getAllUsers, getUserById, updateRole } from "../../../controllers/admin/adminController.js";

router.get("/getAllUsers", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateRole);

export default router;