'use strict';

const mongoose = require('mongoose');
const Admin = require('../models/Admin');

/**
 * Connects to MongoDB using the MONGO_URI environment variable.
 * Exits the process on failure — no point running the server without a DB.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Automatically seed a default admin if none exist (great for new deployments)
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('No admins found in database. Seeding default admin...');
      await Admin.create({
        email: 'admin@leaddesk.com',
        password: 'password123'
      });
      console.log('Default admin seeded: admin@leaddesk.com / password123');
    }
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
