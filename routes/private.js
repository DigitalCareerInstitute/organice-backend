const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");
const passportAuthenticate = passport.authenticate("jwt", { session: false });

// Import the controllers
const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
// const CategoryController = require("../controllers/CategoryController");
const ScanController = require("../controllers/ScanController");

// USER

router.post("/users/update", passportAuthenticate, AuthController.updateUser);
router.post("/users/logout", passportAuthenticate, AuthController.logout);
router.post(
  "/users/updatepassword",
  passportAuthenticate,
  AuthController.updatePassword
);
// SCANS
router.get("/scans", function(req, res) {
  res.send("SCANS");
});

router.post("/scans/add", passportAuthenticate, ScanController.createScan);

router.get("/scans/:id", function(req, res) {
  res.send("SINGLE ONE");
});
router.post(
  "/scans/:id/update",
  passportAuthenticate,
  ScanController.updateScan
);

router.post(
  "/scans/:id/delete",
  passportAuthenticate,
  ScanController.deleteScan
);

module.exports = router;
