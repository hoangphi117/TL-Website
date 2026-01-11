const express = require('express')

const router = express.Router();
const { getAllCategories, getById, getSpecsByCategory } =
        require("../../controllers/categoryController")

router.get("/getAllCategories", getAllCategories);
router.get("/:id", getById);
router.get("/specs/:categoryId", getSpecsByCategory);

module.exports = router;
