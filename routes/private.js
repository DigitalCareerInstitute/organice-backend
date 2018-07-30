const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");
const passportAuthenticate = passport.authenticate("jwt", { session: false });

const AuthController = require("../controllers/AuthController");
const ScanController = require("../controllers/ScanController");
const CategoryController = require("../controllers/CategoryController");

// USER ROUTES
router.post("/users/update", passportAuthenticate, AuthController.updateUser);
router.post("/users/logout", passportAuthenticate, AuthController.logout);
router.post(
  "/users/updatepassword",
  passportAuthenticate,
  AuthController.updatePassword
);

// SCAN ROUTES
router.get("/scans", passportAuthenticate, ScanController.getScans);

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

// CATEGORY ROUTES

router.get(
  "/categories",
  passportAuthenticate,
  CategoryController.getCategories
);

router.post(
  "/categories/add",
  passportAuthenticate,
  CategoryController.createCategory
);

router.post(
  "/categories/:id/update",
  passportAuthenticate,
  CategoryController.updateCategory
);

router.post(
  "/categories/:id/delete",
  passportAuthenticate,
  CategoryController.deleteCategory
);

module.exports = router;
