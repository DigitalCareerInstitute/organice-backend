const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "user ID is needed"
  },
  title: {
    type: String,
    trim: true,
    required: "You must provide a title"
  },
  icon: {
    type: String,
    trim: true,
    required: "You must provide an icon"
  }
});

module.exports = mongoose.model("Category ", categorySchema);
