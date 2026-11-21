const Review = require('../models/Review');

const getReviews = async (req, res) => {
  try {
    const { featured } = req.query;
    const filter = {};
    if (featured === 'true') {
      filter.featured = true;
    }
    const reviews = await Review.find(filter);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve reviews.', error: error.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required.' });
    }

    const review = await Review.create({
      customerName,
      rating: Number(rating),
      comment,
      featured: false
    });

    res.status(201).json({ message: 'Thank you for your feedback!', review });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save review.', error: error.message });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    const updated = await Review.findByIdAndUpdate(req.params.id, {
      featured: !review.featured
    }, { new: true });

    res.status(200).json({ message: 'Review status toggled successfully!', review: updated });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle review features.', error: error.message });
  }
};

module.exports = { getReviews, createReview, toggleFeatured };
