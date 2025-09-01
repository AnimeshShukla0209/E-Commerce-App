// seedCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/category.model'); // adjust path to your Category model

const defaultCategories = [
  { name: 'Groceries' },
  { name: 'Clothing' },
  { name: 'Books' },
  { name: 'Electronics' },
  { name: 'Toys' },
  { name: 'Beauty' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Category.deleteMany({});
    await Category.insertMany(defaultCategories);

    console.log('✅ Categories seeded successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error seeding categories:', err);
    process.exit(1);
  }
}

seed();
