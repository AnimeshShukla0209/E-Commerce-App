const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');

router.get('/', async (req, res) => {
  try {
    console.log('Fetching categories...'); // Debug log
    const categories = await Category.find();
    console.log('Categories fetched:', categories); // Debug log
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err); // Debug log
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;