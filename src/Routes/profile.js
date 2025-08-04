const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../Middleware/Auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

profileRouter.put("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("You are not allowed to edit this field !!");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully !!`,
      data: loggedInUser,
    });
  } catch (err) {
    return res.status(400).send("ERROR :" + err.message);
  }
});
profileRouter.patch("/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    const isPasswordValid = await user.validatePassword(oldPassword);
    if (!isPasswordValid) {
      throw new Error("Old password is incorrect !!");
    }

    user.password = await user.encryptPassword(newPassword);
    await user.save();

    res.send("Password updated successfully !!");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
