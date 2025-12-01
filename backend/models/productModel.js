const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    detailedInfo: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    originalPrice: {
      type: Number,
      default: null,
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },

    specifications: {
      type: String
    },

    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock"],
      default: "active",
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
    },

  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema)

module.exports = Product;