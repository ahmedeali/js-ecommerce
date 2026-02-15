const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Admin
const getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const ordersCount = await Order.countDocuments();

    const orders = await Order.find({});
    const revenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.status(200).json({
      users: usersCount,
      orders: ordersCount,
      revenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Get low stock products
// @route   GET /api/admin/low-stock
// @access  Admin
const getLowStockProducts = async (req, res) => {
    try {
      const products = await Product.find({ countInStock: { $lt: 5 } });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = {
    getStats,
    getLowStockProducts,
  };
  