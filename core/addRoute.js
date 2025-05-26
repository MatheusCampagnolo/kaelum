function addRoute(app, path, handlers = {}) {
  const supportedMethods = ['get', 'post', 'put', 'delete', 'patch'];

  for (const method of supportedMethods) {
    if (handlers[method]) {
      app[method](path, handlers[method]);
    }
  }
}

module.exports = addRoute;