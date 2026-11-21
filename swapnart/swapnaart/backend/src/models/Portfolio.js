const createModel = require('./modelHelper');

const PortfolioSchema = {
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['wedding', 'business', 'branding', 'social-media', 'printing', 'packaging', 'restaurant', 'banners', 'cards', 'videos'], 
    required: true 
  },
  imageUrl: { type: String, required: true },
  beforeImageUrl: { type: String, default: null }, // Support before-after view
  likes: { type: Number, default: 0 }
};

module.exports = createModel('Portfolio', PortfolioSchema);
