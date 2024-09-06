const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  Title: String,
  description: String,
  createDate: String,
  userId: String,
  dueDate: String,
});

module.exports = mongoose.model("tasks", taskSchema);
