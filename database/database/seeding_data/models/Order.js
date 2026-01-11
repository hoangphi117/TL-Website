const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerInfo: {
    fullName: String,
    email: String,
    phoneNumber: String,
    shippingAddress: {
      street: String,
      ward: String,
      district: String,
      city: String
    }
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      sku: String,
      quantity: Number,
      price: Number // Giá tại thời điểm mua (quan trọng)
    }
  ],
  subtotal: { type: Number },
  shippingFee: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  voucherCode: { type: String },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'BankTransfer', 'OnlineGateway'] },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  orderStatus: {
    type: String,
    enum: ['pending_confirmation', 'processing', 'shipping', 'completed', 'cancelled'],
    default: 'pending_confirmation'
  },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);