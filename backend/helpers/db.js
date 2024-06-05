const mongoose = require('mongoose');

const mongooseConnection = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mernblog');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = mongooseConnection;
