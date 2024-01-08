const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3002; 

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userdb');

// Define the User model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: Date,
});

const User = mongoose.model('User', userSchema);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

// Route for user login
app.post('/login', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['username', 'password']);

    const { username, password } = req.body;

    // Find the user by username in the database
    const user = await User.findOne({ username });

    // Check if the user exists and verify the password
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      console.log(user)
      // Respond with the token and user information
      res.json({ token: token, username: username, createdAt: user.createdAt });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});