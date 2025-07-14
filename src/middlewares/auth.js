const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const signInToken = async (id) => {
  const token = await jwt.sign({ id: id }, process.env.JWT_SECRET_KEY);

  return token;
};

const verifyToken = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies.token) {
    return res.status(401).json({ message: "Token is not found!" });
  }
  try {
    const tokenData = await jwt.verify(cookies.token, JWT_SECRET_KEY);
    if (!tokenData) {
      console.log("====================================");
      console.log("token not found");
      console.log("====================================");
      return res.status(401).json({
        message: "Please login",
      });
    }
    const user = await UserModel.findById(tokenData.id);
    if (!user) {
      return res.status(401).json({
        message: "No user is found or invalid token",
      });
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
