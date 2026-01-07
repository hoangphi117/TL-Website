const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  logoUrl: { type: String },
  description: { type: String }
}, { timestamps: false });

module.exports = mongoose.model('Brand', brandSchema);