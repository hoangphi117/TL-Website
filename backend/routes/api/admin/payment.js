import express from "express";
const router = express.Router();
import {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment
} from "../../../controllers/admin/paymentController.js";

router.get("/", getAllPayments);
router.get("/:id", getPaymentById);
router.put("/:id", updatePaymentStatus);
router.delete("/:id", deletePayment);

export default router;