const express = require('express');

function createApp() {
  const app = express();

  return {
    start(port, callback) {
      app.listen(port, callback || (() => {
        console.log(`🚀 Server running on http://localhost:${port}`);
      }));
    },

    setMiddleware(middlewareFn) {
      app.use(middlewareFn);
    },

    get(path, handler) {
      app.get(path, handler);
    },

    post(path, handler) {
      app.post(path, handler);
    },

    // Expondo app raw (caso precise avançado depois)
    // Isso pode ser útil para integrar com outras bibliotecas ou frameworks
    _expressApp: app
  };
}

module.exports = createApp;