// const restify = require("restify");
const Router = require("restify-router").Router;
const router = new Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const UserController = require("../controller/UserController");
const LabelController = require("../controller/LabelController");

router.post("/register", async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    if (err) {
      res.status(500);
      res.json({
        error: err
      });
    } else {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      console.log(user);

      user.save().then(function(result) {
        console.log(result);
        res.json({
          success: result
        });
      });
    }
  });
});

router.post("/signin", function(req, res) {
  User.findOne({ email: req.body.email })
    .exec()
    .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        console.log(result);
        if (err) {
          res.status(401);
          res.send({
            failed: "Unauthorized Access"
          });
        }
        if (result) {
          const JWTToken = jwt.sign(
            {
              email: user.email,
              _id: user._id
            },
            process.env.JWTSECRET,
            {
              expiresIn: "2d"
            }
          );

          res.status(200);
          res.send({
            success: "Welcome to the JWT Auth",
            token: JWTToken
          });
        } else {
          res.status(401);
          res.send({
            failed: "Unauthorized Access"
          });
        }
      });
    })
    .catch(error => {
      res.status(500);
      res.json({
        error: error
      });
    });
});

module.exports = router;
