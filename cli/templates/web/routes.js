// routes.js - example route declarations using Kaelum API
const path = require("path");

module.exports = function (app) {
  // Home: serve the index.html from /views
  app.addRoute("/", {
    get: (req, res) => {
      // send the static HTML file from the views folder
      res.sendFile(path.join(process.cwd(), "views", "index.html"));
    },
  });

  // About page - simple text
  app.addRoute("/about", {
    get: (req, res) => {
      res.send("About Kaelum — a minimal framework scaffolded by the CLI.");
    },
  });

  // Example route using per-path middleware (logger)
  // The middleware is mounted on '/protected' and the route uses it.
  const logger = require("./middlewares/logger");
  app.setMiddleware("/protected", logger);

  app.addRoute("/protected", {
    get: (req, res) => {
      res.send(
        "This route is protected by a simple request logger middleware."
      );
    },
  });
};
