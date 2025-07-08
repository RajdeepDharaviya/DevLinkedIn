const express = require("express");
const app = express();
const { userModel } = require("./src/models/user");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./src/routes/user");
const { profileRouter } = require("./src/routes/profile");
const { connectionRouter } = require("./src/routes/connection");

app.use(express.json());
app.use(cookieParser());
app.use("/user",authRouter);
app.use(profileRouter);
app.use(connectionRouter);


app.listen(3000, () => {
  console.log("Server started at port : 3000");
});
