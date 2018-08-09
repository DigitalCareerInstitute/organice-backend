const path = require("path");
require('dotenv').config({ path: path.join(__dirname + '/.env') });

const server = require("./app")
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
server.listen(port, function () {
    console.log(`👂 Listening at http://${domain}:${port} 👂`);
});