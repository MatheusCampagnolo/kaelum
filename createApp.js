const express = require('express');
const start = require('./core/start');
const addRoute = require('./core/addRoute');
const setMiddleware = require('./core/setMiddleware');
const setConfig = require('./core/setConfig');

function createApp() {
  const app = express();

  app.use(express.static('public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Encapsula as funções novas dentro do objeto app
  app.start = (port, callback) => start(app, port, callback);
  app.addRoute = (path, handlers) => addRoute(app, path, handlers);
  app.setMiddleware = (middleware) => setMiddleware(app, middleware);
  app.setConfig = (config) => setConfig(app, config);

  return app;
}

module.exports = createApp;