// routes.js - registers API endpoints using app.apiRoute
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("./controllers/usersController");

const auth = require("./middlewares/authMock");

module.exports = function (app) {
  // Global example: apply auth middleware on /users POST (create)
  // also demonstrate per-path middleware usage via setMiddleware(path, middleware)
  app.setMiddleware("/users", (req, res, next) => {
    // a small wrapper to demonstrate both setMiddleware signature and route-level control
    // allow GET without auth, require auth for POST/PUT/DELETE by checking method
    if (["POST", "PUT", "DELETE"].includes(req.method)) {
      return require("./middlewares/authMock")(req, res, next);
    }
    next();
  });

  // Resource routes using apiRoute
  app.apiRoute("users", {
    get: getUsers,
    post: createUser,
    "/:id": {
      get: getUserById,
      put: updateUser,
      delete: deleteUser,
    },
  });
};
