import express from 'express'
const router = express.Router();
import { createCategory, getAllCategories, getById, updateCategory, deleteCategory } from "../../../controllers/admin/categoryController.js"

router.post("/createCategory", createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/:id", getById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
