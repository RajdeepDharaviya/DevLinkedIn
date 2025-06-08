const express = require("express");
const { userModel } = require("./src/models/user");
const app = express();
app.use(express.json());

// This api is for adding user or signup
app.post("/signup", async (req, res) => {
  const user = new userModel(req.body);

  try {
    await user.save();
    res.status(200).json({
      message: "User Created successfully",
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
});

// This api is for getting all users
app.get("/feed", async (req, res) => {
  try {
    const users = await userModel.find();
    if (users.length !== 0) {
      res.status(200).json({
        users: users,
      });
    } else {
      res.status(200).json({
        message: "No users existed!",
      });
    }
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
});

// This api is for updating user details
app.patch("/user/:id", async (req, res) => {
  try {
    const userId = req.params?.id;
    const NOT_ALLOWED_UPDATE = [
      "firstName",
      "lastName",
      "gender",
      "password",
      "skills",
    ];
    const isAllowed = Object.keys(req.body).every((key) => {
      return NOT_ALLOWED_UPDATE.includes(key);
    });
    if (!isAllowed) {
      throw new Error("Email id updated in not allowed!");
    }
    const user = await userModel.findByIdAndUpdate(userId, req.body, {
      returnDocument: "before",
      runValidators: true,
    });

    res.status(200).json({
      user: user,
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
});

// This api is for deleting user details
app.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    await userModel.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User deleted successfully!",
    });
  } catch (e) {
    res.status(400).json({
      error: e,
    });
  }
});
app.listen(3000, () => {
  console.log("Server started at port : 3000");
});
