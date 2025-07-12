const express = require("express");
const app = express();
const cors = require("cors")
const cookieParser = require("cookie-parser");
const { authRouter } = require("./src/routes/user");
const { profileRouter } = require("./src/routes/profile");
const { connectionRouter } = require("./src/routes/connection");

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true

}))
app.use(express.json());
app.use(cookieParser());
app.use("/user",authRouter);
app.use("/user",profileRouter);
app.use("/user",connectionRouter);


app.listen(3000, () => {
  console.log("Server started at port : 3000");
});
