const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

router.post('/', async (req, res) => {
  try {
    const { userEmail, productId, quantity } = req.body;
    if (!userEmail || !productId) {
      return res.status(400).json({ message: 'userEmail and productId required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let qty = parseInt(quantity, 10);
    if (!qty || qty < 1) qty = 1;

    let cartItem = await Cart.findOne({ userEmail, productId });
    if (cartItem) {
      cartItem.quantity += qty;
      await cartItem.save();
    } else {
      const newCartItem = new Cart({ userEmail, productId, quantity: qty });
      await newCartItem.save();
    }

    res.json({ message: 'Item added/updated in cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const cartItems = await Cart.find({ userEmail: req.params.email }).populate('productId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:email/:productId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userEmail: req.params.email, productId: req.params.productId });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
