const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
require('dotenv').config();


// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['buyer', 'vendor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ name, email, mobile, password, role });
    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });

  if (!user) return res.status(400).json({ message: 'Invalid email or role' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  // ✅ Fetch all users and log in table format (hide passwords)
  const allUsers = await User.find().select('-password');
  console.log('📋 Users in Database:');
  console.table(
    allUsers.map(u => ({
      Name: u.name,
      Email: u.email,
      Mobile: u.mobile,
      Role: u.role,
      Address:u.address
    }))
  );

  // Send success response
  res.status(200).json({ message: 'Login successful', user });
});


router.post('/login/admin', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Not an admin' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({
      message: 'Admin login successful',
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/users/update/:id
router.put('/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, mobile, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, mobile, address },
      { new: true } // return updated version
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;


