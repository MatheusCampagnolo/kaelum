const userController = require("./controllers/userController");
const logger = require("./middlewares/logger");

function Routes(app) {
  app.addRoute("/users", {
    get: [logger, userController.getUsers],
    post: [logger, userController.createUser],
  });
}

module.exports = Routes;