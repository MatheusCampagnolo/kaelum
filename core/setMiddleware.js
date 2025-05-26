function setMiddleware(app, middleware) {
  if (!app || typeof app.use !== 'function') {
    throw new Error("Invalid app instance: cannot apply middleware");
  }
  
  if (typeof middleware !== 'function') {
    throw new Error("Middleware must be a function");
  }

  app.use(middleware);
}

module.exports = setMiddleware;