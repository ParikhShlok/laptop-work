const createModel = require('./modelHelper');

const OrderSchema = {
  customer: { type: String, required: true }, // User ID
  designer: { type: String, default: null }, // User ID (Admin/Designer)
  service: { type: String, default: null }, // Service ID (if applicable)
  serviceTitle: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'designing', 'revision', 'printing', 'completed', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  requirements: { type: String, default: '' },
  attachments: [{ type: String }],
  finalFiles: [{ type: String }],
  pricing: { type: Number, default: 0 },
  deliveryDate: { type: String, default: '' },
  invoiceNumber: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' }
};

module.exports = createModel('Order', OrderSchema);
