// createApp.js (root)
// Kaelum factory: creates an Express app with Kaelum helpers
// - enables JSON and URL-encoded body parsing by default
// - stores references to parsers and static middleware so they can be replaced by setConfig
// - wraps core/setConfig to support toggles via setConfig({ ... })
// - exposes existing core helpers (start, addRoute, setMiddleware, apiRoute)
// - exposes error handler helper app.useErrorHandler()

const express = require("express");
const path = require("path");

const start = require("./core/start");
const addRoute = require("./core/addRoute");
const apiRoute = require("./core/apiRoute");
const setMiddleware = require("./core/setMiddleware");
const coreSetConfig = require("./core/setConfig");
const { errorHandler } = require("./core/errorHandler");
const registerHealth = require("./core/healthCheck");

function createApp() {
  const app = express();

  // store runtime config in locals
  app.locals.kaelumConfig = app.locals.kaelumConfig || {};

  // --- Default static middleware (store reference so setConfig can replace it) ---
  const defaultStatic = express.static(path.join(process.cwd(), "public"));
  app.locals._kaelum_static = defaultStatic;
  app.use(defaultStatic);

  // --- Body parsers (enabled by default) ---
  const jsonParser = express.json();
  const urlencodedParser = express.urlencoded({ extended: true });

  // Keep references so we can remove them later if requested
  app.locals._kaelum_bodyparsers = [jsonParser, urlencodedParser];

  // Apply them by default
  app.use(jsonParser);
  app.use(urlencodedParser);

  // --- wrapper for core.setConfig ---
  app.setConfig = function (options = {}) {
    // call core setConfig if available (it will persist merged config)
    try {
      coreSetConfig(app, options);
    } catch (e) {
      // fallback merge and persist locally
      const prev = app.locals.kaelumConfig || {};
      app.locals.kaelumConfig = Object.assign({}, prev, options);
      app.set("kaelum:config", app.locals.kaelumConfig);
    }

    // read merged config
    const cfg = app.get("kaelum:config") || app.locals.kaelumConfig || {};

    // Body parser toggle handled by core.setConfig (which manipulates app._router.stack)

    return cfg;
  };

  // convenience getter
  app.getKaelumConfig = function () {
    return app.get("kaelum:config") || app.locals.kaelumConfig || {};
  };

  // convenience wrapper to set static folder directly
  app.static = function (dir) {
    if (!dir) {
      // if no dir passed, act as getter
      return app.getKaelumConfig().static || null;
    }
    return app.setConfig({ static: dir });
  };

  // convenience method to remove static middleware
  app.removeStatic = function () {
    return app.setConfig({ static: false });
  };

  // ---------------------------
  // middleware utility helpers
  // ---------------------------

  // remove middleware by matching the function reference from the express internal stack
  function removeMiddlewareByFn(appInstance, fn) {
    if (
      !appInstance ||
      !appInstance._router ||
      !Array.isArray(appInstance._router.stack)
    )
      return;
    appInstance._router.stack = appInstance._router.stack.filter(
      (layer) => layer.handle !== fn
    );
  }

  // ---------------------------
  // bind existing core helpers to the app
  // ---------------------------
  if (typeof start === "function") {
    app.start = function (port, cb) {
      return start(app, port, cb);
    };
  }

  if (typeof addRoute === "function") {
    app.addRoute = function (routePath, handlers) {
      return addRoute(app, routePath, handlers);
    };
  }

  if (typeof apiRoute === "function") {
    app.apiRoute = function (resource, handlers) {
      return apiRoute(app, resource, handlers);
    };
  }

  if (typeof setMiddleware === "function") {
    app.setMiddleware = function (middlewareOrPath, maybeMiddleware) {
      // forward call to core/setMiddleware - keep signature flexible
      if (arguments.length === 2) {
        return setMiddleware(app, middlewareOrPath, maybeMiddleware);
      }
      return setMiddleware(app, middlewareOrPath);
    };
  }

  if (typeof registerHealth === "function") {
    app.healthCheck = function (routePath = "/health") {
      registerHealth(app, routePath);
      return app;
    };
  }

  // ---------------------------
  // Error handler exposure
  // ---------------------------
  // Expose a convenience method to register Kaelum's generic error handler.
  // Accepts same options as errorHandler factory: { exposeStack: boolean }
  app.useErrorHandler = function (options = {}) {
    // If an error handler was previously registered by Kaelum, remove it first.
    if (app.locals && app.locals._kaelum_errorhandler) {
      removeMiddlewareByFn(app, app.locals._kaelum_errorhandler);
      app.locals._kaelum_errorhandler = null;
    }

    const mw = errorHandler(options);
    // store reference and install as final middleware
    if (!app.locals) app.locals = {};
    app.locals._kaelum_errorhandler = mw;
    app.use(mw);
    return app;
  };

  // alias for convenience
  app.errorHandler = app.useErrorHandler;

  return app;
}

module.exports = createApp;
