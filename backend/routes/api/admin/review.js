import express from "express";
const router = express.Router();
import {
    getAllReviews,
    approveReview,
    rejectReview,
    replyToReview,
    deleteReviewByAdmin
} from "../../../controllers/admin/reviewController.js";

router.get("/", getAllReviews);
router.get("/:id/approve", approveReview);
router.put("/:id/approve", approveReview);
router.put("/:id/reject", rejectReview);
router.put("/:id/reply", replyToReview);
router.delete("/:id", deleteReviewByAdmin);

export default router;