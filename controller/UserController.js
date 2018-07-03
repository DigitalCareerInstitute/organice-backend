const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");

exports.authenticate = async (req, res) => {
  if (!req.user) {
    return res.redirect("/api/users/register");
  }

  const users = await User.findOne();

  response.render("api/scans/");
};
