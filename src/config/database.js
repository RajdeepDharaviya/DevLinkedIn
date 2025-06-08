const mongoose = require("mongoose");

//Set up default mongoose connection
const connectDB = async () => {
  var mongoDB =
    "mongodb+srv://rajdeepdharaviya:mongoRajdeep211@cluster0.wvu6i.mongodb.net/devTinder?retryWrites=true&w=majority&appName=Cluster0";
  await mongoose.connect(mongoDB);
};

module.exports = { connectDB };
