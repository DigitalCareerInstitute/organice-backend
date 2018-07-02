const restify = require("restify");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");

require("dotenv").config({ path: "variables.env" });

require("./models/User");
require("./models/Label");

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

const server = restify.createServer();

// function respond(req, res, next) {
//   res.send("hello " + req.params.name);
//   next();
// }
// server.get("/hello/:name", respond);
// server.head("/hello/:name", respond);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.use(function logger(req, res, next) {
  console.log(new Date(), req.method, req.url);
  next();
});

server.on("uncaughtException", function(request, response, route, error) {
  console.error(error.stack);
  response.send(error);
});

userRoutes.applyRoutes(server, "/api/users");

server.listen(8080, function() {
  console.log("%s listening at %s", server.name, server.url);
});
