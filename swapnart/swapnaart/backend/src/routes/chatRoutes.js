const express = require('express');
const router = express.Router();
const { getChatHistory, getChatContacts } = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getChatHistory);
router.get('/contacts', authMiddleware, getChatContacts);

module.exports = router;
