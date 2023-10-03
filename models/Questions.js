const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: String,
  votes: Number,
});

const questionSchema = new mongoose.Schema({
  text: String,
  options: [optionSchema],
});

module.exports = mongoose.model("Question", questionSchema);
