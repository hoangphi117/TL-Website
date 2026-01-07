import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

export const updateProductRating = async (productId) => {
  try {
    const pid = new mongoose.Types.ObjectId(productId);

    const reviews = await Review.find({
      productId: pid,
      status: "approved",
    });

    // Không có review => reset về 0
    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(pid, {
        averageRating: 0,
        reviewCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = totalRating / reviews.length;

    await Product.findByIdAndUpdate(pid, {
      averageRating: Number(avg.toFixed(1)),
      reviewCount: reviews.length,
    });

  } catch (error) {
    console.error("Error updating product rating:", error.message);
  }
};