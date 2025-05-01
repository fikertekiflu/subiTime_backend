const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to generate a JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET, // Ensure this matches the secret used in authenticateToken
    { expiresIn: '7d' }
  );
};

// Function to authenticate and verify a JWT token
const authenticateToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure this matches the secret used in generateToken
    return decoded; // Return the decoded user information
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = { generateToken, authenticateToken };