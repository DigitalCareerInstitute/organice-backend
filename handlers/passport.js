const passport = require("passport");
const mongoose = require("mongoose");
const path = require("path");
require('dotenv').config({path: path.join(__dirname + '/../.env')});
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// const User = mongoose.model("User");
const userSchema = require("../models/User");
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken("jwt"),
      secretOrKey: process.env.JWTSECRET,
      passReqToCallback: true
    },
    function(req, jwtPayload, cb) {
      return User.findById(jwtPayload.id)
        .then(user => {
          // console.log("Found user by Token :");
          // console.log(user);
          return cb(null, user);
        })
        .catch(err => {
          // console.log("did not find user");
          // console.log(err);
          return cb(err);
        });
    }
  )
);
