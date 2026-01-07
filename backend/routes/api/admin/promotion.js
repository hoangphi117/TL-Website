import express from 'express';

const router = express.Router();
import { createPromotion, getAllPromotions, getPromotionById, updatePromotion, deletePromotion } from "../../../controllers/admin/promotionController.js";

router.post("/createPromotion", createPromotion);
router.get("/getAllPromotions", getAllPromotions);
router.get("/:id", getPromotionById);
router.put("/:id", updatePromotion);
router.delete("/:id", deletePromotion);

export default router;