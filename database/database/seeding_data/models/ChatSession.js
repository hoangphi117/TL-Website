const mongoose = require('mongoose');

const chatSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  messages: [
    {
      sender: { type: String, enum: ['user', 'bot'] },
      message: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('ChatSession', chatSessionSchema);