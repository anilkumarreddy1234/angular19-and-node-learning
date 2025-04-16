const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

const url = require("./config/db.config");

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Import route files

const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');


// Mount routes with base paths
app.use('/users', usersRouter);
app.use('/login', loginRouter);


// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Multi-Route Express API!');
});

// 1. Import Mongoose
const mongoose = require('mongoose');

// 2. Connect to MongoDB
const connectDB = async () => {
  try {
    // Replace 'mongodb://localhost:27017/mydb' with your MongoDB URI
    console.log(url)
    await mongoose.connect(url.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process if connection fails
  }
};

// 5. Example Usage: Create and Save a User
const runExample = async () => {
  await connectDB(); // Connect to DB
};

// Run the example
runExample();

// Start the server
app.listen(port, () => {
  console.log(`Server.. running on http://localhost:${port}`);
});