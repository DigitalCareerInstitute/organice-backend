const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
// const User = mongoose.model("User", UserModel.userSchema);
const passport = require("passport");
const promisify = require("es6-promisify");

exports.register = async (req, res, next) => {
  const register = promisify(User.register, User);

  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  register(user, req.body.password)
    .then(user => {
      const jwtToken = jwt.sign(
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

      console.log(jwtToken);

      user.token = jwtToken;
      user.save();

      res.json({
        code: 200,
        message: "User registered successfully. Please check the email.",
        user: {
          name: req.body.name,
          email: req.body.email,
          id: user._id,
          token: user.token
        }
      });
      next();
    })
    .catch(error => {
      res.json(422, {
        code: 422,
        message: "Unprocessable entity",
        error
      });
      next(false);
    });
};

exports.deleteAllUsers = async (req, res, next) => {
  User.remove({}, function(err) {
    console.log("All users are removed");
    res.send("Successfully deleted all users");
    next();
  });
};

// exports.login = passport.authenticate("local", function(req, res, next) {
//   res.json({
//     code: 200,
//     message: "Successfully logged in",
//     user: {
//       name: res.name,
//       email: res.email,
//       id: res._id
//     }
//   });
//   next().catch(error => {
//     res.json(442, {
//       code: 422,
//       message: "Invalid Email or password",
//       error
//     });
//   });
//   next();
// });

// exports.login = passport.authenticate("local", function(req, res) {
//   console.log("---------req--------------");
//   console.log(req);
//   console.log("-----------res------------");
//   console.log(res);
//   const email = res.email;
//   const name = res.name;
//   const id = res._id;
//   console.log("----------res.id-------------");
//   console.log(res._id);
//   console.log("-----------------------");
//   res.json({
//     name,
//     email,
//     id
//   });
// });

// exports.oldLogin = function(req, res) {
//   User.findOne({ email: req.body.email })
//     .exec()
//     .then(function(user) {
//       bcrypt.compare(req.body.password, user.password, function(err, result) {
//         console.log(result);
//         if (err) {
//           res.status(401);
//           res.send({
//             failed: "Unauthorized Access"
//           });
//         }
//         if (result) {
//           const JWTToken = jwt.sign(
//             {
//               email: user.email,
//               _id: user._id,
//               name: user.name
//             },
//             process.env.JWTSECRET,
//             {
//               expiresIn: "2d"
//             }
//           );

//           res.status(200);
//           res.send({
//             success: `Welcome to OrgaNice '${user.name}'`,
//             token: JWTToken
//           });
//         } else {
//           res.status(401);
//           res.send({
//             failed: "Unauthorized Access"
//           });
//         }
//       });
//     })
//     .catch(error => {
//       res.status(500);
//       res.json({
//         error: error
//       });
//     });
// };
