const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  first_name: {
    type: String
    // required: "You must provide a first name"
  },
  last_name: {
    type: String
    // required: "You must provide a last name"
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "Please supply an email address"
    // validate: [validator.isEmail, "Invalid email address"],
  },
  password: {
    type: String,
    required: "You must provide a password"
  },
  birthday: { type: Date },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9\- +\(\)\/]{10,30}+$/.test(v);
      },
      message: "Please supply a valid phone number!"
    }
  },
  avatar: String,
  photo: String,
  slug: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

// userSchema.methods.generateHash = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
// };

// userSchema.method.validatePassword = function(password) {
//   return bcrypt.compareSync(password, this.local.password);
// };

// userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
// userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
