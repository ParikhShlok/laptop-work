const createModel = require('./modelHelper');

const MessageSchema = {
  order: { type: String, default: null }, // Optional: link chat to an order context
  sender: { type: String, required: true }, // User ID
  recipient: { type: String, required: true }, // User ID (normally admin for customers, or customer for admin)
  message: { type: String, default: '' },
  type: { type: String, enum: ['text', 'image', 'file', 'quote'], default: 'text' },
  attachments: [{ type: String }],
  read: { type: Boolean, default: false }
};

module.exports = createModel('Message', MessageSchema);
