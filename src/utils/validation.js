const { log } = require("console");
const validator = require("validator");

const validateData = (body) => {
  const { firstName, lastName, emailId, password, age } = body;

  if (!firstName || !lastName) {
    res.status(411).json({ message: "Please enter all fields!" });
  }
  if (!validator.isEmail(emailId)) {
    res.status(411).json({ message: "Please enter valid email id !" });
  }
  if (!validator.isStrongPassword(password)) {
    res.status(411).json({ message: "Please enter strong password!" });
  }

  if (!isNaN(age)) {
    if (age < 0) {
      res.status(411).json({ message: "Please enter valid age!" });
    }
  }
};

const validateSignIn = (body) => {
  const { emailId, password } = body;

  if (!password) {
    res.status(411).json("Please enter password!");
  }
  if (!validator.isEmail(emailId)) {
    res.status(411).json("Please enter valid email id !");
  }
};
module.exports = { validateData, validateSignIn };
