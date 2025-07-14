const mongoose = require("mongoose");

//Set up default mongoose connection
const connectDB = async () => {
  await mongoose.connect(process.env.DATABASE_URL);
};

module.exports = { connectDB };
