import express from 'express';

const router = express.Router();
import { createBrand, getAllBrands, updateBrand, deleteBrand } from "../../../controllers/admin/brandController.js";

router.post("/createBrand", createBrand);
router.get("/getAllBrands", getAllBrands);
router.put("/:id", updateBrand);
router.delete("/:id", deleteBrand);

export default router;