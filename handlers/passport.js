const passport = require("passport");
const mongoose = require("mongoose");
require("dotenv").config({ path: "variables.env" });
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// const User = mongoose.model("User");
const User = require("../models/User");

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// another login method

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password"
//     },
//     function(email, password, cb) {
//       //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
//       return User.findOne({ email, password })
//         .then(user => {
//           if (!user) {
//             return cb(null, false, { message: "Incorrect email or password." });
//           }
//           return cb(null, user, { message: "Logged In Successfully" });
//         })
//         .catch(err => cb(err));
//     }
//   )
// );

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("jwt"),
      secretOrKey: process.env.JWTSECRET
    },
    function(jwtPayload, cb) {
      console.log("test");
      return User.findById(jwtPayload.id)
        .then(user => {
          console.log("found user");
          console.log(user);
          return cb(null, user);
        })
        .catch(err => {
          console.log("did not find user");
          console.log(err);
          return cb(err);
        });
    }
  )
);
