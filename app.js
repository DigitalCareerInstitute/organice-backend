const restify = require("restify");
const util = require("util");
const mongoose = require("mongoose");
const validator = require("validator");
const passport = require("passport");
const promisify = require("es6-promisify");
const expressValidator = require("express-validator");
const restifyValidator = require("restify-validator");
const errorHandlers = require("./handlers/errorHandlers");
const JWTAuthenticatedUser = require("./handlers/JWTAuthenticatedUser");
const path = require("path");
require("./handlers/passport");
require('dotenv').config({path: path.join(__dirname + '/.env')});
//const requireAuth = passport.authenticate("jwt", { session: false });

const routes = {
  public: require("./routes/public"),
  private: require("./routes/private")
};

const server = restify.createServer();

// Require the models
require("./models/User");
require("./models/Category");
require("./models/Scan");

// Passport
server.use(passport.initialize());
server.use(passport.session());

// Promisify
server.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

// MONGOOSE
let mongooseOptions = {};

if (
  process.env.DATABASE_USERNAME &&
  process.env.DATABASE_PASSWORD &&
  process.env.DATABASE_USERNAME.trim() !== "" &&
  process.env.DATABASE_PASSWORD.trim() !== ""
) {
  mongooseOptions = {
    auth: {
      user: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD
    }
  };
}

mongoose.Promise = global.Promise;
mongoose
  .connect(
    `mongodb://${process.env.DATABASE_HOST || localhost}:${process.env
      .DATABASE_PORT || 27017}/${process.env.DATABASE_NAME ||
      "react-native-app"}`,
    mongooseOptions
  )
  .catch(error => {
    console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${error.message}`);
    process.exit(1);
  });

// Restify Server

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restify.plugins.urlEncodedBodyParser());
// server.use(restifyValidator);
// server.use(expressValidator());

server.use(function logger(req, res, next) {
  console.log(new Date(), req.method, req.url);
  next();
});

server.on("uncaughtException", function(req, res, route, error) {
  console.error(error.stack);
  res.send(error);
});

routes.public.applyRoutes(server, "/api");
routes.private.applyRoutes(server, "/api");

// server.get("/api", requireAuth, async (req, res, next) => {
//   res.send("valid");
//   next();
// });

// server.get("/api", JWTAuthenticatedUser.check);
//server.use(JWTAuthenticatedUser.check);

// server.use(passport.authenticate("jwt", { session: false }));

// Display the routes in the console ;)
const port = process.env.PORT || "8080";
const domain = process.env.DOMAIN || "localhost";

console.log("Routes:");
for (const key in server.router._registry._routes) {
  console.log(
    "\x1b[36m%s\x1b[0m",
    key,
    `http://${domain}:${port}${server.router._registry._routes[key].spec.path}`
  );
}
console.log(`========================`);

server.listen(port, function() {
  console.log(`👂 Listening at http://${domain}:${port} 👂`);
});

/* ERROR HANDLING */

// server.use(errorHandlers.notFound);

// server.use(errorHandlers.flashValidationErrors);

// if (server.get("env") === "development") {
//   server.use(errorHandlers.developmentErrors);
// }

// server.use(errorHandlers.productionErrors);
