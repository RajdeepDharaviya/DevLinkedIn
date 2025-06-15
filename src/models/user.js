const mongoose = require("mongoose");
const { connectDB } = require("../config/database");
const validator = require("validator");

connectDB();
// creating a user schema with required fields
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      maxlength: 10,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: 15,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 20,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address!" + value);
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: Boolean,
      required: true,
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender dat1a is not valid!");
      //   }
      // },
    },
    skills: {
      type: [String],
      default: ["js", "react", "node"],
    },
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = function () {};
// creating a user model with required fields
const UserModel = mongoose.model("users", userSchema);

module.exports = { UserModel };
