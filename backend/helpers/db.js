const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const mongooseConnection = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    console.log('MongoDB URL:', mongoUrl);  
    if (!mongoUrl) {
      throw new Error('MongoDB URL not defined in environment variables');
    }
    await mongoose.connect(mongoUrl);  
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = mongooseConnection;
