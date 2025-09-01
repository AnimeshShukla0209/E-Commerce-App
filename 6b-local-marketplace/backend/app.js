const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Category = require('./models/category.model');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files (e.g., uploaded images)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static(uploadDir));

// Database Connection
mongoose.connect(process.env.MONGO_URI).then(async () => {
  
    console.log('MongoDB Connected');
}).catch( (error)=> {
    console.error('Error inserting categories:', error);
  })

// Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/orders', require('./routes/order.routes'));
app.use('/api/cart', require('./routes/cart.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/vendor-orders', require('./routes/vendor-orders.routes'));
app.use('/api/refund', require('./routes/refund.routes'));
app.use('api/track-order', require('./routes/order-tracking.routes'));
// Home route (optional)
app.get('/', (req, res) => {
  res.send('🚀 Server is running. Use /api/orders, /api/users, etc.');
});

// Error handler (must be last!)
app.use(require('./middleware/errorHandler'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});