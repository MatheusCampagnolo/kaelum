// core/setMiddleware.js
// Register middleware(s) on the Express app
// Usage:
// - setMiddleware(app, middlewareFn)
// - setMiddleware(app, [mw1, mw2])
// - setMiddleware(app, '/path', middlewareFn) -> mounts on a path

function isFunction(v) {
  return typeof v === 'function';
}

function setMiddleware(app, a, b) {
  // Signature variants:
  // setMiddleware(app, middleware)
  // setMiddleware(app, [middleware1, middleware2])
  // setMiddleware(app, path, middleware)

  if (!app || typeof app.use !== 'function') {
    throw new Error('Invalid app instance: cannot apply middleware');
  }

  // two args -> could be (app, middlewareOrArray) OR (app, path)
  if (arguments.length === 2) {
    const middleware = a;
    if (typeof middleware === 'string') {
      throw new Error('Missing middleware function for given path');
    }
    if (Array.isArray(middleware)) {
      middleware.forEach((mw) => {
        if (!isFunction(mw)) throw new Error('All middlewares in array must be functions');
        app.use(mw);
      });
      return;
    }
    if (!isFunction(middleware)) {
      throw new Error('Middleware must be a function or an array of functions');
    }
    app.use(middleware);
    return;
  }

  // three args -> (app, path, middleware)
  if (arguments.length === 3) {
    const path = a;
    const middleware = b;
    if (typeof path !== 'string') {
      throw new Error('Path must be a string when using three-argument setMiddleware');
    }
    if (Array.isArray(middleware)) {
      middleware.forEach((mw) => {
        if (!isFunction(mw)) throw new Error('All middlewares in array must be functions');
        app.use(path, mw);
      });
      return;
    }
    if (!isFunction(middleware)) {
      throw new Error('Middleware must be a function or an array of functions');
    }
    app.use(path, middleware);
    return;
  }

  throw new Error('Invalid number of arguments for setMiddleware');
}

module.exports = setMiddleware;