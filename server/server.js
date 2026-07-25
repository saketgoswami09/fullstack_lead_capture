'use strict';

require('dotenv').config();

const connectDB = require('./config/db');
const app       = require('./config/app');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

start();
