const express = require('express');
const start = require('./core/start');
const addRoute = require('./core/addRoute');
const setMiddleware = require('./core/setMiddleware');

function createApp() {
  const app = express();

  // Encapsula as funções novas dentro do objeto app
  app.start = (port, callback) => start(app, port, callback);
  app.addRoute = (path, handlers) => addRoute(app, path, handlers);
  app.setMiddleware = (middleware) => setMiddleware(app, middleware);

  return app;
}

module.exports = createApp;