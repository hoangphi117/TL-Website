import express from 'express';

const router = express.Router();
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../../../controllers/admin/productController.js";

router.post("/createProduct", createProduct);
router.get("/getAllProducts", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;