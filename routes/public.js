const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");

// Import the controllers
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
const ScanController = require("../controllers/ScanController");
const CategoryController = require("../controllers/CategoryController");

// router.post("/register", UserController.register, function(req, res, next) {
//   passport.authenticate("local-signup", { failureRedirect: "/register" }),
//     res.redirect(404, "/", next);
// });

router.post("/register", UserController.register);
router.post("/login", AuthController.login);

router.del("/users/deleteAll", UserController.deleteAllUsers);
router.del("/scans/deleteAll", ScanController.deleteAllScans);
router.del("/categories/deleteAll", CategoryController.deleteAllCategories);

module.exports = router;
