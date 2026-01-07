const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const mongoose = require("mongoose");

//[Get] - All Category
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("parentCategory", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

//[Get]- By ID
const getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "parentCategory",
      "name"
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "No category found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error server",
      error: error.message,
    });
  }
};

//[Get] Lấy danh sách các thông số kỹ thuật (specifications) của sản phẩm theo Category
const getSpecsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: 'Invalid Category ID' });
    }

    const specifications = await Product.aggregate([
      //Lọc sản phẩm theo Category
      {
        $match: {
          category: new mongoose.Types.ObjectId(categoryId),
          status: 'active'
        }
      },

      {
        $project: {
          specifications: 1
        }
      },

      //Biến đổi Object specifications thành Array để xử lý động
      //Từ { cpu: "i5", ram: "16gb" } -> [ {k: "cpu", v: "i5"}, {k: "ram", v: "16gb"} ]
      {
        $project: {
          specsArray: { $objectToArray: "$specifications" }
        }
      },

      //Tách mảng ra (Unwind)
      {
        $unwind: "$specsArray"
      },

      //Gom nhóm (Group) theo Key (k) và lấy các giá trị duy nhất (v)
      {
        $group: {
          _id: "$specsArray.k", // Group theo tên thông số (cpu, ram, v.v.)
          values: { $addToSet: "$specsArray.v" } // $addToSet giúp loại bỏ giá trị trùng lặp
        }
      },
      
      {
        $project: {
            _id: 1,
            values: { $sortArray: { input: "$values", sortBy: 1 } }
        }
      }
    ]);

    //Format lại kết quả từ Array về Object để Client dễ dùng
    // Ta chuyển về: { "cpu": [...], "ram": [...] }
    
    const result = specifications.reduce((acc, curr) => {
      acc[curr._id] = curr.values;
      return acc;
    }, {});

    return res.status(200).json({
      message: "Specifications fetched successfully",
      data: result
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = { getAllCategories, getById, getSpecsByCategory };