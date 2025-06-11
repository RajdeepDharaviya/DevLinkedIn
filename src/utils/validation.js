const { log } = require("console");
const validator = require("validator");

const validateData = (body) => {
  const { firstName, lastName, emailId, password, age } = body;

  if (!firstName || !lastName) {
    throw new Error("Please enter all fields!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email id !");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password!");
  }
  if (!validator.isNumeric(age)) {
    if (age < 0) {
      throw new Error("Please enter valid age!");
    }
  }
};

const validateSignIn = (body) => {
  const { emailId, password } = body;

  if (!password) {
    throw new Error("Please enter password!");
  }
  if (!validator.isEmail(emailId)) {
    throw new Error("Please enter valid email id !");
  }
};
module.exports = { validateData, validateSignIn };
