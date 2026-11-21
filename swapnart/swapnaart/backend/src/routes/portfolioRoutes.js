const express = require('express');
const router = express.Router();
const { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio, likePortfolioItem } = require('../controllers/portfolioController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const portfolioUploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'beforeImage', maxCount: 1 }
]);

router.get('/', getPortfolios);
router.post('/', authMiddleware, checkRole(['admin']), portfolioUploadFields, createPortfolio);
router.put('/:id', authMiddleware, checkRole(['admin']), updatePortfolio);
router.delete('/:id', authMiddleware, checkRole(['admin']), deletePortfolio);
router.post('/:id/like', likePortfolioItem);

module.exports = router;
