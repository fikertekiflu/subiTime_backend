const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (token) => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Return the decoded user information
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = authenticateToken;