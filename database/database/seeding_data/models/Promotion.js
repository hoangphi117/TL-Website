const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'fixed_amount'] },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number },
  startDate: { type: Date },
  endDate: { type: Date },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);