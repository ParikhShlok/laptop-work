const createModel = require('./modelHelper');

const ServiceSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  deliveryTime: { type: String, required: true },
  category: { type: String, required: true },
  features: [{ type: String }],
  image: { type: String, default: '' },
  faqs: [{
    q: { type: String },
    a: { type: String }
  }]
};

module.exports = createModel('Service', ServiceSchema);
