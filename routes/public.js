const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");

// Import the controllers
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");

router.post("/register", UserController.register);
router.post("/login", AuthController.login);
router.del("/api/users/delete", UserController.deleteAllUsers);
module.exports = router;
