// deleteAll.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db'); // your db.js file

async function deleteAllCollections() {
  try {
    await connectDB(); // connect to MongoDB

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
      console.log(`Cleared collection: ${collection.collectionName}`);
    }

    console.log('✅ All collections cleared.');
    process.exit();
  } catch (err) {
    console.error('❌ Error clearing collections:', err);
    process.exit(1);
  }
}

deleteAllCollections();
