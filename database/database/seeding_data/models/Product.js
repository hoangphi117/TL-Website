const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  sku: { type: String, unique: true, required: true },
  description: { type: String },
  detailedInfo: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stockQuantity: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  // Sử dụng Mixed cho specifications để linh động lưu object tùy ý
  specifications: { type: mongoose.Schema.Types.Mixed },
  status: { type: String, enum: ['active', 'inactive', 'out_of_stock'], default: 'active' },
  tags: [{ type: String, index: true }],
  averageRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 }
}, { timestamps: true });

// Tạo text index để hỗ trợ tìm kiếm nâng cao sau này
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);