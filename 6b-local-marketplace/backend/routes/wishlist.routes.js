const express = require('express');
const router = express.Router();
const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');

router.post('/', async (req, res) => {
  try {
    const { userEmail, productId } = req.body;
    if (!userEmail || !productId) {
      return res.status(400).json({ message: 'userEmail and productId required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const exists = await Wishlist.findOne({ userEmail, productId });
    if (exists) return res.status(400).json({ message: 'Item already in wishlist' });

    const newWishlist = new Wishlist({ userEmail, productId });
    await newWishlist.save();

    res.json({ message: 'Item added to wishlist' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({ userEmail: req.params.email }).populate('productId');
    res.json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:email/:productId', async (req, res) => {
  try {
    await Wishlist.findOneAndDelete({ userEmail: req.params.email, productId: req.params.productId });
    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
