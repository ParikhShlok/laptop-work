const express = require('express');
const router = express.Router();
const { getDesigns, getDesignById, createDesign, updateDesign, deleteDesign } = require('../controllers/designController');
const { authMiddleware, checkRole } = require('../middleware/auth');

router.get('/', authMiddleware, checkRole(['admin', 'designer']), getDesigns);
router.get('/:id', authMiddleware, checkRole(['admin', 'designer']), getDesignById);
router.post('/', authMiddleware, checkRole(['admin', 'designer']), createDesign);
router.put('/:id', authMiddleware, checkRole(['admin', 'designer']), updateDesign);
router.delete('/:id', authMiddleware, checkRole(['admin', 'designer']), deleteDesign);

module.exports = router;
