const mongoose = require("mongoose");
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const scanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: "user ID is needed"
  },
  // category: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Category",
  //   required: "Category ID is needed"
  // },
  category: {
    type: String
  },
  title: {
    type: String,
    trim: true,
    required: "You must provide a name",
    unique: true
  },
  image: {
    type: String,
    trim: true
    // required: "You must provide an icon"
    /* image base 64 */
  },
  content: {
    type: String,
    trim: true
    // required: "There must be a content"
    /* "long string" includes the text of the image */
  },
  date: {
    type: Date
  }
  // date_from_scan : {
  //   content:
  //   }
});

scanSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("Scan", scanSchema);