const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const { Thought } = require("../models");

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();

      const thoughtObj = {
        thoughts,
      };

      res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought
  async getSingleThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;

      if (!mongoose.isValidObjectId(thoughtId)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json({
        thought,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);

      // Assuming you have some way to identify the user (e.g., username)
      const username = req.body.username;

      // Find the user by their username
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add the objectId of the thought to the user's thoughts array
      user.thoughts.push(thought._id);

      // Save the user document to persist the changes
      await user.save();

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a thought
  async updateThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      console.log(thoughtId);
      if (!mongoose.isValidObjectId(thoughtId)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No such thought exists" });
      }

      res.json({
        message: "Thought successfully updated",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Delete a thought
  async deleteThought(req, res) {
    try {
      const thoughtId = req.params.thoughtId;

      if (!mongoose.isValidObjectId(thoughtId)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No such thought exists" });
      }

      res.json({
        message: "Thought successfully deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // Add a reaction
  async addReaction(req, res) {
    try {
      const thoughtId = req.params.thoughtId;
      const newReaction = req.body;

      // Find the thought by ID
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: "Thought not found" });
      }

      // Add the new reaction to the reactions array/subdocument
      thought.reactions.push(newReaction);

      // Save the user document to persist the changes
      await thought.save();

      res.status(201).json(thought);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // Delete a reaction
  async deleteReaction(req, res) {
    try {
      const reactionId = req.params.reactionId;

      if (!mongoose.isValidObjectId(reactionId)) {
        return res.status(404).json({ message: "Invalid ID" });
      }

      const reaction = await Reaction.findOneAndRemove({
        _id: req.params.reactionId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No such thought exists" });
      }

      res.json({
        message: "Thought successfully deleted",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};
