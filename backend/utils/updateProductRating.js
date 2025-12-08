const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const updateProductRating = async (productId) => {
  try {
    const reviews = await Review.find({
      productId: productId,
      status: "approved",
    });

    if (reviews.length === 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: 0,
        reviewCount: 0,
      });
      return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = totalRating / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: avg.toFixed(1),
      reviewCount: reviews.length,
    });

  } catch (error) {
    console.error("Error updating product rating:", error.message);
  }
};

module.exports = { updateProductRating };