import express from 'express';

const router = express.Router();
import { getAllBrands, getBrandsByCategory } from "../../controllers/brandController.js";


router.get("/getAllBrands", getAllBrands);
router.get("/:categoryId", getBrandsByCategory)

export default router;