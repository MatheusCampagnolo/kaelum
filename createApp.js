const express = require('express');
const start = require('./core/start');

function createApp() {
  const app = express();

  // Adiciona a função start ao app
  app.start = function(port, callback) {
    start(app, port, callback);
  };

  return app;
}

module.exports = createApp;