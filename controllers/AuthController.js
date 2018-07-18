const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("../handlers/passport");
// const User = mongoose.model("User");
const promisify = require("es6-promisify");
const User = require("../models/User");

exports.validateRegister = (req, res, next) => {
  req.sanitize("name");
  req.check("name", "You must supply a name!").notEmpty();
  req.check("email", "That Email is not valid!").isEmail();

  req.check("password", "Password Cannot be Blank!").notEmpty();
  req
    .check("password-confirm", "Confirmed Password cannot be blank!")
    .notEmpty();
  req
    .check("password-confirm", "Oops! Your passwords do not match")
    .equals(req.body.password);

  // const errors = req.validationErrors();
  // if (errors) {
  //   req.flash('error', errors.map(err => err.msg));
  //   res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
  //   return; // stop the fn from running
  // }
  next(); // there were no errors!
};

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    return;
  }
  res.json({
    code: 403,
    message: "You must login first!!"
  });

  // res.redirect("api/users/login");
};

exports.login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    console.log("---------user--------------");
    console.log(user);
    if (err) {
      return next(err);
    }
    if (!user) {
      res.json(401, {
        code: 401,
        message: "Invalid Email or password",
        user
      });
    }
    if (user) {
      const JWTToken = jwt.sign(
        {
          name: user.name,
          email: user.email,
          id: user._id
        },
        process.env.JWTSECRET,
        {
          expiresIn: "2d"
        }
      );
      User.findByIdAndUpdate({ _id: user._id }, { token: JWTToken }).exec();

      res.json({
        code: 200,
        message: `Welcome to OrgaNice '${user.name}'`,
        user: {
          name: user.name,
          email: user.email,
          id: user._id,
          token: JWTToken
        }
      });
    }
    req.logIn(user, { session: false }, err => {
      if (err) {
        return next(err);
      }
      console.log("api/users/" + user._id + "/scans");
      // return res.redirect("api/users/" + user._id + "/scans");
    });
  })(req, res, next);
};

exports.updateUser = async (req, res, next) => {
  const user = await User.findOneAndUpdate({ _id: req.user._id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  // console.log(req.headers);
  console.log("===============user=============");
  console.log(user);
  if (!user) {
    res.json(404, {
      code: 404,
      message: "user not found"
    });
    next(false);
  }
  res.json({
    code: 200,
    message: `Successfully updated '${user.name}'`,
    user: {
      name: req.body.name,
      email: req.body.email,
      id: user._id,
      token: user.token
    }
  });
};

// exports.editUser = async (req, res, next) => {
//   const user = await User.findOneAndUpdate({ _id: req.headers.id }, req.body, {
//     new: true,
//     runValidators: true
//   })
//     .exec()
//     .then(
//       function(sanitizedUser) {
//         if (sanitizedUser) {
//           sanitizedUser.setPassword(newPasswordString, function() {
//             sanitizedUser.save();
//             res.status(200).json({ message: "password reset successful" });
//           });
//         } else {
//           res.status(500).json({ message: "This user does not exist" });
//         }
//       },
//       function(err) {
//         console.error(err);
//       }
//     );
// };

exports.logout = (req, res, next) => {
  req.logout();
  res.json({
    message: "successfully logged out"
  });
  next();
};

// exports.logout = (req, res, next) => {
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       console.log(id);
//       done(err, user);
//     });
//   });
//   // User.findByIdAndUpdate({ _id: user._id }, { token: "" }).exec();
//   console.log("test");

//   // req.logout();
// };
