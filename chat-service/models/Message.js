const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  senderId: { type: String, required: true }, // Can be ObjectId if linked to User
  roomId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'allowed', 'flagged', 'blocked'], 
    default: 'pending' 
  },
  moderation: {
    action: String,
    labels: [String],
    scores: Map
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
