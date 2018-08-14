const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const categorySchema = require("../models/Category");
const scanSchema = require("../models/Scan");
const scanModel = mongoose.model("Scan", scanSchema);
const categoryModel = mongoose.model("Category", categorySchema);

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "You must supply a user name",
    unique: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Please supply an email address",
    validate: [validator.isEmail, "Invalid email address"]
  },
  token: {
    type: String,
    trim: true,
    unique: true
  },
  avatar: String /* optional for the moment*/,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/* Settings for passport-local-mongoose  */

userSchema.pre("remove", function(next) {
  // 'this' is the user being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  scanModel.remove({ user: this._id }).exec();
  categoryModel.remove({ user: this._id }).exec();
  next();
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

module.exports = userSchema;
