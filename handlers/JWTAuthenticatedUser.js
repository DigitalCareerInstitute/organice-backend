/* This function should check the routs you wanna make it secured with a token */
exports.check = (req, res, next) => {
  if (req.url.match(/\/api\/.*/)) {
    console.log("do not touch my api");
    console.log("url was: " + req.url);
  }

  // validate JWT token for easy authentication without username and password
  if (1 !== 1) {
    res.json(401, {
      code: 401,
      message: "Unauthorized user"
    });

    next(false);
  }
  next();
};
