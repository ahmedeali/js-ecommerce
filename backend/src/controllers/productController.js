const asyncHandler = require('../middleware/asyncHandler');

const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});


// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json(product);
});


// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, countInStock, image } = req.body;

  const product = new Product({
    name,
    description,
    price,
    countInStock,
    image,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});



module.exports = {
  getProducts,
  getProductById,
  createProduct,
};

