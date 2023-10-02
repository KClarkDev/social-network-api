const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();

      const userObj = {
        users,
      };

      res.json(userObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const userId = req.params.userId;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).json({ message: "Invalid user ID" });
      }

      const user = await User.findOne({
        _id: req.params.userId,
      }).select("-__v");

      if (!user) {
        return res.status(404).json({ message: "No user with that ID" });
      }

      res.json({
        user,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a user record
  async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      console.log(userId);
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).json({ message: "Invalid user ID" });
      }

      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      res.json({
        message: "User successfully updated",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete a user and remove their associated thoughts
  async deleteUser(req, res) {
    try {
      const userId = req.params.userId;

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(404).json({ message: "Invalid user ID" });
      }

      const user = await User.findOneAndRemove({
        _id: req.params.userId,
      });

      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      if (!user.thoughts.length) {
        return res.status(404).json({
          message: "User deleted, but no thoughts found",
        });
      }

      // Remove all thoughts associated with the deleted user
      await Thought.deleteMany({ username: user.username });

      res.json({
        message: "User and associated thoughts successfully deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Add a friend
  async addFriend(req, res) {
    try {
      const userId = req.params.userId;
      const newFriend = req.body;

      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add the new friend to the user's friend list
      user.friends.push(newFriend);

      // Save the user document to persist the changes
      await user.save();

      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // Remove a friend
  async removeFriend(req, res) {
    try {
      const friendId = req.params.friendId;

      if (!mongoose.isValidObjectId(friendId)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const userId = req.params.userId;

      // Find the thought by ID
      const user = await Thought.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find the index of the friend within the user's friend list
      const friendIndex = user.friends.findIndex(
        (friend) => friend._id.toString() === friendId
      );

      if (friendIndex === -1) {
        return res.status(404).json({ message: "Friend not found" });
      }

      // Remove the friend from the user's friend list
      user.friends.splice(friendIndex, 1);

      // Save the user document to persist the changes
      await user.save();

      res.json({
        message: "Friend successfully removed",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
