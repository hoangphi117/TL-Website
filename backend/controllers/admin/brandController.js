const Brand = require('../../models/brandModel');

const createBrand = async (req, res) => {
  try {
    const { name, logoUrl, description } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }
    const newBrand = new Brand({
      name,
      logoUrl,
      description,
    });     
    await newBrand.save();
    res.status(201).json({
      success: true,
      message: "Successfully created a brand",
      data: newBrand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand name already exists",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });        
  }
}