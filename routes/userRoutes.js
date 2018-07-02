// const restify = require("restify");
const Router = require("restify-router").Router;
const router = new Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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

module.exports = router;
