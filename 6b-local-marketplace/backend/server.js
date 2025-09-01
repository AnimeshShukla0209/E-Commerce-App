// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/user.routes');
// const productRoutes = require('./routes/product.routes');
// const path = require('path');
// const fs = require('fs');


// dotenv.config();
// const app = express();

// // Connect MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB Connected'))
//   .catch(err => console.error('Mongo Error:', err));

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes);
// // Add this line with your other routes

// // Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }


