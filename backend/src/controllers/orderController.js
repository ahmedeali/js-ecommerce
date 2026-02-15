const Product = require('../models/Product');

const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // 🔥 STOCK CONTROL
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      // reduce stock
      product.countInStock -= item.qty;
      await product.save();
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔥 If cancelling → restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);

        if (product) {
          product.countInStock += item.qty;
          await product.save();
        }
      }
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
};
