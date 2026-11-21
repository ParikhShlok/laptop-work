const express = require('express');
const router = express.Router();
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authMiddleware, checkRole } = require('../middleware/auth');

router.get('/', getServices);
router.get('/:id', getServiceById);
router.post('/', authMiddleware, checkRole(['admin']), createService);
router.put('/:id', authMiddleware, checkRole(['admin']), updateService);
router.delete('/:id', authMiddleware, checkRole(['admin']), deleteService);

module.exports = router;
