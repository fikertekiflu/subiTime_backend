const Admin = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controller for checking if an email exists
exports.checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (user) {
      res.status(200).json({ message: 'Email found.' });
    } else {
      res.status(404).json({ message: 'Email not found.' });
    }
  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ✅ RESET PASSWORD
exports.resetPasswordEmail = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await Admin.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'Email not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword.trim(), salt);

    user.password = hashedPassword;

    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ message: 'Password reset successfully.', token }); // Send the new token
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};