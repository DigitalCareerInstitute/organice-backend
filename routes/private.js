const Router = require("restify-router").Router;
const router = new Router();
const passport = require("passport");
const passportAuthenticate = passport.authenticate("jwt", { session: false });

const AuthController = require("../controllers/AuthController");
const UserController = require("../controllers/UserController");
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

router.post("/users/delete", passportAuthenticate, UserController.deleteUser);

// SCAN ROUTES
router.get("/scans", passportAuthenticate, ScanController.getScans);

router.get("/scans/:id", passportAuthenticate, ScanController.getSingleScan);

router.post(
  "/scans/add",
  passportAuthenticate,
  // ScanController.upload,
  // ScanController.uploadError
  ScanController.resize,
  ScanController.createScan
);

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

router.get(
  "/categories/:id",
  passportAuthenticate,
  CategoryController.getSingleCategory
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
