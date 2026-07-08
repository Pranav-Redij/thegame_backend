const express = require("express");
const router = express.Router();

const users = require("../models/users");
const { jwtAuthMiddleware } = require("../jwt");

router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const user = await users
      .findById(req.user.id)
      .populate("friends", "username");

    return res.status(200).json(user.friends);
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/add", jwtAuthMiddleware, async (req, res) => {
  try {
    const { friendUsername } = req.body;

    const currentUser = await users.findById(req.user.id);

    const friendUser = await users.findOne({
      username: friendUsername,
    });

    if (!friendUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (currentUser._id.toString() === friendUser._id.toString()) {
      return res.status(400).json({
        error: "Cannot add yourself",
      });
    }

    const alreadyFriend = currentUser.friends.includes(friendUser._id);

    if (alreadyFriend) {
      return res.status(400).json({
        error: "Already friends",
      });
    }

    currentUser.friends.push(friendUser._id);

    friendUser.friends.push(currentUser._id);

    await currentUser.save();
    await friendUser.save();

    return res.status(200).json({
      message: "Friend added successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;
