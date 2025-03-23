require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');

const Product = require('./models/Product.js'); // Corrected path to include .js extension


const products = [
  {
    name: "Sample Product 1",
    description: "Description for Sample Product 1",
    price: 10.99,
    image: "http://example.com/image1.png",
    category: "Electronics",
    subcategory: "Reusable",
    size: "F"
  },
  {
    name: "Sample Product 2",
    description: "Description for Sample Product 2",
    price: 15.99,
    image: "http://example.com/image2.png",
    category: "Scrap Metal",
    subcategory: "Non-Reusable",
    size: "H"
  }
];

console.log('MONGO_URI:', process.env.MONG); // Log the MONGO_URI for verification
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

  .then(async () => {
    console.log('MongoDB connected successfully');
    await Product.insertMany(products);
    console.log('Test products added successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
