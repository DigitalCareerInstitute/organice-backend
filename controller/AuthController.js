const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
// const User = mongoose.model("User");
const promisify = require("es6-promisify");
const User = require("../models/User");

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.json({
    code: 403,
    message: "You must login first!!"
  });

  res.redirect("api/users/login");
};

exports.login = function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    console.log("---------user--------------");
    console.log(user);
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json(401, {
        code: 401,
        message: "Invalid Email or password"
      });
    }
    if (user) {
      res.json({
        code: 200,
        message: "Successfully logged in",
        user: {
          name: user.name,
          email: user.email,
          id: user._id
        }
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      console.log("api/users/" + user._id + "/scans");
      return res.redirect("api/users/" + user._id + "/scans");
    });
  })(req, res, next);
};

exports.logout = function(req, res, next) {
  req.logout();
  res.json({
    message: "successfully logged out"
  });
  next();
};
