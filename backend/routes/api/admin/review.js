const express = require("express");
const router = express.Router();
const {
    getAllReviews,
    approveReview,
    rejectReview,
    replyToReview,
    deleteReviewByAdmin
} = require("../../../controllers/admin/reviewController");
// Get all reviews

router.get("/", getAllReviews);
// Approve a review
router.put("/:id/approve", approveReview);
router.put("/:id/reject", rejectReview);
router.put("/:id/reply", replyToReview);
router.delete("/:id", deleteReviewByAdmin);

module.exports = router;