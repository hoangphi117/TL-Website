const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  imageUrl: { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }
}, { timestamps: false }); // Danh mục ít khi cần time track, tùy bạn chọn

module.exports = mongoose.model('Category', categorySchema);