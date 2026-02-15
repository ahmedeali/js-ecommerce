const express = require('express');
const router = express.Router();

const { getStats, getLowStockProducts } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.get('/low-stock', protect, admin, getLowStockProducts);

module.exports = router;
