const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../src/models/user'); // Import the User model

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if the admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin123@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create the admin user
    const adminUser = new User({
      email: 'admin123@gmail.com',
      password: hashedPassword,
    });

    // Save the admin user to the database
    await adminUser.save();
    console.log('✅ Admin user created successfully');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

seedAdmin();