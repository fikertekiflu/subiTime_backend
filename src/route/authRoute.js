const express = require('express');
const { login } = require('../controller/authController'); // Import the login controller

const router = express.Router();

// Login Route
router.post('/login', login);

module.exports = router;