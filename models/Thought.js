const { Schema, model } = require("mongoose");

// Schema to create a reaction model
const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema to create a thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // the user that created the thought
    username: {
      type: String,
      required: true,
    },
    // Array of nested documents created with the reactionSchema
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual getter method to format the createdAt date
thoughtSchema.virtual("formattedCreationDate").get(function () {
  const formattedDate = this.createdAt.toLocaleString();
  return formattedDate;
});

// Virtual getter method to format the createdAt date
reactionSchema.virtual("formattedCreationDate").get(function () {
  const formattedDate = this.createdAt.toLocaleString();
  return formattedDate;
});

const Thought = model("thought", thoughtSchema);

module.exports = Thought;
