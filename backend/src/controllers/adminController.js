const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');


// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
  const usersCount = await User.countDocuments();
  const ordersCount = await Order.countDocuments();

  const orders = await Order.find({});
  const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

  res.status(200).json({
    users: usersCount,
    orders: ordersCount,
    revenue,
  });
});

// @desc    Get low stock products
// @route   GET /api/admin/low-stock
// @access  Admin
const getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ countInStock: { $lt: 5 } });
  res.status(200).json(products);
});


  module.exports = {
    getStats,
    getLowStockProducts,
  };
  