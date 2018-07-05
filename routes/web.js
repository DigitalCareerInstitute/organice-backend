const restify = require("restify");
const Router = require("restify-router").Router;
const router = new Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Import the controllers

const UserController = require("../controller/UserController");
// const CategoryController = require("../controller/CategoryController");
// const ScanController = require("../controller/ScanController");

router.post("/api/users/register", UserController.register);
router.post("/api/users/login", UserController.login);

module.exports = router;
