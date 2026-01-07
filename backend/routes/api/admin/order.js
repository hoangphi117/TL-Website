import express from "express";
const router = express.Router();
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../../../controllers/admin/orderController.js";

router.get("/getAllOrders", getAllOrders);
router.get("/:id", getOrderById);
router.put("/update/:id", updateOrderStatus);

export default router;
