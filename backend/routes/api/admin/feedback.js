import express from "express";
const router = express.Router();
import {
  getAllFeedbacks,
  getFeedbackById,
  replyToFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} from "../../../controllers/admin/feedbackController.js";

router.get("/getAllFeedbacks", getAllFeedbacks);
router.get("/:id", getFeedbackById);
router.post("/:id", replyToFeedback);
router.patch("/:id", updateFeedbackStatus);
router.delete("/:id", deleteFeedback);

export default router;
