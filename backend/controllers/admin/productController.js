const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
const Brand = require("../../models/brandModel");

// [Post] - admin - create product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      detailedInfo,
      price,
      originalPrice,
      stockQuantity,
      images,
      category,
      brand,
      specifications,
      status,
      tags,
    } = req.body;

    if (!name || !sku || !price || !stockQuantity || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, SKU, price, stockQuantity, and category are required",
      });
    }

    const newProduct = new Product({
      name,
      sku,
      description,
      detailedInfo,
      price,
      originalPrice,
      stockQuantity,
      images,
      category,
      brand,
      specifications,
      status,
      tags,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Successfully created a product",
      data: newProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Product SKU already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};
