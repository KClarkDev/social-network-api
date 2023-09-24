const { Schema, model } = require("mongoose");

// Schema to create a thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      // between 1 and 280 characters
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      // use a getter method to format the timestamp on query
    },
    username: {
      type: String,
      required: true,
    },
    // Array of nested documents created with the reactionSchema
    reactions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reaction",
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

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
