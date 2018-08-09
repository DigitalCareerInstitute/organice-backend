const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const md5 = require("md5");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcrypt");
const bcryptNodeJs = require("bcrypt-nodejs");

const scanModel = require("./Scan");
const categoryModel = require("./Category");

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

/* GENERATING HASH */

// userSchema.methods.generateHash = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.local.password);
// };

/* Generating AVATAR for the user relying on GRAVATAR */
// userSchema.virtual("gravatar").get(function() {
//  const hash = md5(this.email)
//  return `https://gravatar.com/avatar/${hash}?s=200`
// });

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
