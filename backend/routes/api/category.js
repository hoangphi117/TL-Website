import express from 'express'
const router = express.Router();
import { getAllCategories, getById } from "../../controllers/categoryController.js"

router.get("/getAllCategories", getAllCategories);
router.get("/:id", getById);

export default router;
