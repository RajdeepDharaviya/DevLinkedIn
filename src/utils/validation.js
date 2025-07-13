const validator = require("validator");

const validateData = (req, res, next) => {
  const { firstName, lastName, emailId, password, age } = req.body;

  if (!firstName || !lastName) {
    return res.status(411).json({ message: "Please enter all fields!" });
  }
  if (!validator.isEmail(emailId)) {
    return res.status(411).json({ message: "Please enter valid email id !" });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(411).json({ message: "Please enter strong password!" });
  }

  if (!isNaN(age)) {
    if (age < 0) {
      return res.status(411).json({ message: "Please enter valid age!" });
    }
  }
  next();
};

const validateSignIn = (req, res, next) => {
  const { emailId, password } = req.body;

  if (!password) {
    return res.status(411).json({ message: "Please enter password!" });
  }
  if (!validator.isEmail(emailId)) {
    return res.status(411).json({ message: "Please enter valid email id !" });
  }
  next();
};
module.exports = { validateData, validateSignIn };
