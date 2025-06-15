const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const SECRET_KEY = "devTinder@123";

const signInToken = async (id) => {
  const token = await jwt.sign({ id: id }, SECRET_KEY);

  return token;
};

const verifyToken = async (req, res, next) => {
  const cookies = req.cookies;
  try {
    const tokenData = await jwt.verify(cookies.token, SECRET_KEY);
    if (!tokenData) {
      throw new Error("Invalid token!");
    }
    const user = await UserModel.findById(tokenData.id);
    if (!user) {
      throw new Error("No token is matching!");
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

module.exports = { signInToken, verifyToken };
