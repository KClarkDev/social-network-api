const { Schema, model } = require("mongoose");

// Schema to create a thought model
const userSchema = new Schema(
  {
    username: {
      type: String,
      // unique
      required: true,
      // trimmed
    },
    email: {
      type: String,
      // unique
      required: true,
      // must match a valid email address (look into Mongoose matching validation)
    },
    // Array of _id values referencing the Thought model
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    // Array of _id values referencing the User model (self-reference)
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "Friend",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// TODO: Create a virtual called friendCount that retrieves the length of the user's friends array field on query.

const User = model("user", userSchema);

module.exports = User;
