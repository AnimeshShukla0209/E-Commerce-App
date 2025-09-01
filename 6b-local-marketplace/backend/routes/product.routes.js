const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const multer = require('multer');
const path = require('path');

// Configure image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Add Product
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock, category, email, area } = req.body;

    if (!name || !price || !stock || !category || !email || !area) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({ name, price, stock, category, email, area,imageUrl});
    await product.save();

    res.status(201).json({ message: 'Product added', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Search products by name and/or area
router.get('/search', async (req, res) => {
  const { name, area, email } = req.query;

  const query = {};
  if (name) query.name = new RegExp(name, 'i');
  if (area) query.area = new RegExp(area, 'i');
  if (email) query.email = email; // ✅ filter only products of this vendor

  try {
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get products by vendor email
router.get('/by-vendor/:email', async (req, res) => {
  try {
    const products = await Product.find({ email: req.params.email });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (for buyers)
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Update product
router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, stock, category, area } = req.body;
    const updatedFields = { name, price, stock, category, area };
    if (req.file) {
      updatedFields.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    res.status(200).json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /products/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/category/:name', async (req, res) => {
  const categoryName = req.params.name;

  try {
    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
