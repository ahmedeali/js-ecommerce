const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Calculate total
    const totalPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const order = new Order({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
