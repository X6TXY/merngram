const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const mongooseConnection = async () => {
  try {

    const mongoUrl = process.env.MONGODB_URL;
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

module.exports = mongooseConnection;