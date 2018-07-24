const passport = require("passport");
const crypto = require("crypto");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("../handlers/passport");
// const User = mongoose.model("User");
const promisify = require("es6-promisify");
const User = require("../models/User");
require("../handlers/passport");

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
  // console.log(req);
  passport.authenticate("local", { session: false }, (err, user, info) => {
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
          // name: user.name,
          email: user.email,
          id: user._id
        },
        process.env.JWTSECRET,
        {
          expiresIn: "365d"
        }
      );
      User.findByIdAndUpdate({ _id: user._id }, { token: JWTToken }).exec();

      console.log("---------user--------------");
      console.log(user);
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

exports.updatePassword = async (req, res, next) => {
  console.log("=============update-password===================");

  const user = req.user;

  if (!user) {
    res.json({
      code: 403,
      message: "Password reset is invalid or has expired."
    });
  }

  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updatedUser = await user.save();
  console.log("==================updated USer===============");
  console.log(updatedUser);
  res.json({
    code: 200,
    message: `Password successfully updated for user '${user.name}'`,
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,

      token: updatedUser.token,
      hash: updatedUser.hash
    }
  });
};

exports.logout = (req, res, next) => {
  console.log("====================logout-user===================");
  console.log(req.user);
  req.logout();

  // const test = User.findById({ id: user._id });
  // console.log(test);
  // const test2 = User.findById(jwtPayload.id);
  // console.log(test2);
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

// exports.updatePasswordOld = async (req, res, next) => {
//   const user = await User.findOneAndUpdate({ _id: req.user.id }, req.body, {
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
//   console.log("============userPassword==================");
//   console.log(user);
// };
