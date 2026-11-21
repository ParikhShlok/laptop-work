const createModel = require('./modelHelper');

const ReviewSchema = {
  customerName: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },
  featured: { type: Boolean, default: false }
};

module.exports = createModel('Review', ReviewSchema);
