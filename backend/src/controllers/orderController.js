const asyncHandler = require('../middleware/asyncHandler');

const Product = require('../models/Product');

const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  // Stock control
  for (const item of orderItems) {
    const product = await Product.findById(item.product);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.countInStock < item.qty) {
      res.status(400);
      throw new Error(`Not enough stock for ${product.name}`);
    }

    product.countInStock -= item.qty;
    await product.save();
  }

  const totalPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice,
  });

  res.status(201).json(order);
});



// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Restore stock if cancelled
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
});



module.exports = {
  createOrder,
  getMyOrders,
  updateOrderStatus,
};
