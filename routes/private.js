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

// SCANS
router.get("/scans", function(req, res) {
  res.send("SCANS");
});

router.post("/scans/add", ScanController.createScan);

router.get("/scans/:id", function(req, res) {
  res.send("SINGLE ONE");
});
router.post("/scans/update", ScanController.updateScan);

router.post("/scans/delete", ScanController.deleteScan);

module.exports = router;
