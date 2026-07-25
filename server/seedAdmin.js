require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lead-capture');
    
    const email = 'admin@leaddesk.com';
    const password = 'password123';

    // Check if admin already exists
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const admin = await Admin.create({
      email,
      password,
    });

    console.log('Admin created successfully:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
