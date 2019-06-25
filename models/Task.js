const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const Taskschema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deadline: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Task = mongoose.model("task", Taskschema);
