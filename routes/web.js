const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");

// Import the controllers
const AuthController = require("../controller/AuthController");
const UserController = require("../controller/UserController");
// const CategoryController = require("../controller/CategoryController");
// const ScanController = require("../controller/ScanController");

router.post("api/users/register", UserController.register);

// Authentication
router.post("api/users/login", AuthController.login);

router.post("api/users/:id/logout", AuthController.logout);

router.get("api/users/:id/scans", function(req, res) {
  res.send("SCANS");
});

// DELETE ALL USERS FROM DATABASE
router.del("api/users/delete", UserController.deleteAllUsers);

module.exports = router;
