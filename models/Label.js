const mongoose = require("mongoose");

const labelSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "You must provide a name"
  },
  icon: {
    type: String,
    trim: true,
    required: "You must provide an icon"
  }
});

module.exports = mongoose.model("Label", labelSchema);
