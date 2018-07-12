const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const md5 = require("md5");
const isEmail = require("validator/lib/isEmail");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

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
    validate: [isEmail, "Invalid email address"]
  },
  // avatar: String, /* optional for the moment*/
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/* Generating AVATAR for the user relying on GRAVATAR */
// userSchema.virtual("gravatar").get(function() {
//  const hash = md5(this.email)
//  return `https://gravatar.com/avatar/${hash}?s=200`
// });

userSchema.plugin(passportLocalMongoose, { usernameField: "name" });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
