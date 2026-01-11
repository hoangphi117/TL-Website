const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String },
  phoneNumber: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  adminReply: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);