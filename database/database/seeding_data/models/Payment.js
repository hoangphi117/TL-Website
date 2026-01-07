const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  method: { type: String },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  transactionCode: { type: String, index: true }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);