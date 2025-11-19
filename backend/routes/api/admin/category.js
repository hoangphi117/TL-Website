const express = require('express')

const router = express.Router();
const {createCategory, getAllCategories,getById,updateCategory,deleteCategory} = 
        require("../../../controllers/admin/categoryController")

router.post("/admin/createCategory",createCategory);
router.get("/getAllCategories",getAllCategories);
router.get("/getCategory",getById);
router.put("/admin/updateCategory",updateCategory);
router.delete("/admin/deleteCategory",deleteCategory);

module.exports = router;
