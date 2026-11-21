const express = require('express');
const router = express.Router();
const { getReviews, createReview, toggleFeatured } = require('../controllers/reviewController');
const { authMiddleware, checkRole } = require('../middleware/auth');

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id/featured', authMiddleware, checkRole(['admin']), toggleFeatured);

module.exports = router;
