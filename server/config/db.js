const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error("message", err.message, "end of message");
    console.error("all", err, "end of all");
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;