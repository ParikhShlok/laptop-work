const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  assignDesigner,
  uploadFinalFiles,
  updatePaymentStatus
} = require('../controllers/orderController');
const { authMiddleware, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.array('attachments', 10), createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, checkRole(['admin', 'designer']), updateOrderStatus);
router.put('/:id/assign', authMiddleware, checkRole(['admin']), assignDesigner);
router.post('/:id/upload-final', authMiddleware, checkRole(['admin', 'designer']), upload.array('finalFiles', 10), uploadFinalFiles);
router.put('/:id/payment', authMiddleware, checkRole(['admin']), updatePaymentStatus);

module.exports = router;
