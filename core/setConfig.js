// core/setConfig.js
// Kaelum centralized configuration helper.
// - Supports toggling CORS, Helmet, static folder, Morgan logs, bodyParser, and port.
// - Persists merged config to app.locals and app.set("kaelum:config", ...).
// - Idempotent: won't add the same Kaelum-installed middleware twice and can remove them.

const path = require("path");

function tryRequire(name) {
  try {
    return require(name);
  } catch (e) {
    return null;
  }
}

/**
 * Merge new options into existing stored config
 * @param {Object} app
 * @param {Object} options
 * @returns {Object} merged config
 */
function persistConfig(app, options = {}) {
  const prev = app.locals.kaelumConfig || {};
  const merged = Object.assign({}, prev, options);
  app.locals.kaelumConfig = merged;
  if (typeof app.set === "function") app.set("kaelum:config", merged);
  return merged;
}

/**
 * Remove a middleware function reference from express stack
 * Safely filters layers whose handle === fn
 * @param {Object} app
 * @param {Function} fn
 */
function removeMiddlewareByFn(app, fn) {
  if (!app || !app._router || !Array.isArray(app._router.stack)) return;
  app._router.stack = app._router.stack.filter((layer) => layer.handle !== fn);
}

/**
 * Install middleware (store reference in app.locals under key)
 * If there is a previous middleware stored at that key, remove it first.
 * @param {Object} app
 * @param {string} localKey
 * @param {Function} middlewareFn
 */
function installMiddleware(app, localKey, middlewareFn) {
  if (!app) return;
  // remove previous if exists
  const prev = app.locals && app.locals[localKey];
  if (prev) {
    try {
      removeMiddlewareByFn(app, prev);
    } catch (e) {
      // ignore removal errors
    }
  }
  app.locals[localKey] = middlewareFn;
  app.use(middlewareFn);
}

/**
 * Remove middleware stored in app.locals under localKey
 * @param {Object} app
 * @param {string} localKey
 */
function removeLocalMiddleware(app, localKey) {
  if (!app || !app.locals) return;
  const prev = app.locals[localKey];
  if (prev) {
    try {
      removeMiddlewareByFn(app, prev);
    } catch (e) {
      // ignore
    }
    app.locals[localKey] = null;
  }
}

/**
 * Ensure body parsers exist (and store references)
 * @param {Object} app
 */
function ensureBodyParsers(app) {
  if (!app.locals) app.locals = {};
  if (
    !Array.isArray(app.locals._kaelum_bodyparsers) ||
    app.locals._kaelum_bodyparsers.length === 0
  ) {
    const expressPkg = tryRequire("express") || require("express");
    const jsonParser = expressPkg.json();
    const urlencodedParser = expressPkg.urlencoded({ extended: true });
    app.locals._kaelum_bodyparsers = [jsonParser, urlencodedParser];
    app.use(jsonParser);
    app.use(urlencodedParser);
  }
}

/**
 * Remove Kaelum-installed body parsers
 * @param {Object} app
 */
function removeKaelumBodyParsers(app) {
  if (!app || !app.locals) return;
  const arr = app.locals._kaelum_bodyparsers;
  if (Array.isArray(arr)) {
    arr.forEach((fn) => {
      try {
        removeMiddlewareByFn(app, fn);
      } catch (e) {
        // ignore
      }
    });
  }
  app.locals._kaelum_bodyparsers = [];
}

/**
 * Apply configuration options to the app
 * @param {Object} app - express app instance
 * @param {Object} options - supported keys: cors, helmet, static, logs, port, bodyParser
 * @returns {Object} merged config
 */
function setConfig(app, options = {}) {
  if (!app) throw new Error("setConfig requires an app instance");

  // ensure locals exist
  app.locals = app.locals || {};

  // merge/persist config first
  const cfg = persistConfig(app, options);

  // --- CORS ---
  if (options.hasOwnProperty("cors")) {
    // If user wants to enable CORS
    if (options.cors) {
      const corsPkg = tryRequire("cors");
      if (!corsPkg) {
        console.warn(
          "Kaelum: cors package not installed. Skipping CORS setup."
        );
      } else {
        // create middleware from provided options if object, or empty opts
        const corsOpts = options.cors === true ? {} : options.cors;
        const middleware = corsPkg(corsOpts);
        installMiddleware(app, "_kaelum_cors", middleware);
        console.log("🛡️  CORS activated.");
      }
    } else {
      // disable Kaelum-installed CORS if present
      removeLocalMiddleware(app, "_kaelum_cors");
      console.log("🛡️  CORS disabled (Kaelum-installed instance removed).");
    }
  }

  // --- Helmet ---
  if (options.hasOwnProperty("helmet")) {
    if (options.helmet) {
      const helmetPkg = tryRequire("helmet");
      if (!helmetPkg) {
        console.warn(
          "Kaelum: helmet package not installed. Skipping Helmet setup."
        );
      } else {
        const helmetOpts = options.helmet === true ? {} : options.helmet;
        const middleware = helmetPkg(helmetOpts);
        installMiddleware(app, "_kaelum_helmet", middleware);
        console.log("🛡️  Helmet activated.");
      }
    } else {
      removeLocalMiddleware(app, "_kaelum_helmet");
      console.log("🛡️  Helmet disabled (Kaelum-installed instance removed).");
    }
  }

  // --- Static folder handling ---
  if (options.hasOwnProperty("static")) {
    // remove previous Kaelum static
    removeLocalMiddleware(app, "_kaelum_static");

    if (options.static) {
      const expressStatic = (tryRequire("express") || require("express"))
        .static;
      const dir =
        typeof options.static === "string"
          ? path.resolve(process.cwd(), options.static)
          : path.join(process.cwd(), "public");
      const staticFn = expressStatic(dir);
      installMiddleware(app, "_kaelum_static", staticFn);
      console.log(`📁 Static files served from ${dir}`);
    } else {
      // static === false -> nothing to add, just removed above
      console.log("📁 Static serving disabled.");
    }
  }

  // --- Body parser toggle ---
  if (options.hasOwnProperty("bodyParser")) {
    if (options.bodyParser === false) {
      // remove Kaelum-installed body parsers
      removeKaelumBodyParsers(app);
      console.log("📦 Body parsers disabled (Kaelum-installed removed).");
    } else {
      // enable if not present
      ensureBodyParsers(app);
      console.log("📦 Body parsers enabled (JSON + URL-encoded).");
    }
  } else {
    // no explicit bodyParser option -> ensure default enabled if not present
    ensureBodyParsers(app);
  }

  // --- Logs (morgan) ---
  if (options.hasOwnProperty("logs")) {
    // remove previous logger first
    removeLocalMiddleware(app, "_kaelum_logger");

    if (options.logs) {
      const morgan = tryRequire("morgan");
      if (!morgan) {
        console.warn("Kaelum: morgan package not installed. Skipping logs.");
      } else {
        // allow user to pass string format or object; default to 'dev'
        const format = options.logs === true ? "dev" : options.logs || "dev";
        const logger = morgan(format);
        installMiddleware(app, "_kaelum_logger", logger);
        console.log("📊 Request logging enabled (morgan).");
      }
    } else {
      console.log("📊 Request logging disabled.");
    }
  }

  // --- Port persisted in config (start will read it) ---
  if (options.hasOwnProperty("port")) {
    const p = options.port;
    if (p === false || p === null) {
      // unset
      const merged = Object.assign({}, app.locals.kaelumConfig);
      delete merged.port;
      app.locals.kaelumConfig = merged;
      if (typeof app.set === "function") app.set("kaelum:config", merged);
      console.log("🔌 Port preference cleared from Kaelum config.");
    } else if (typeof p === "number" || typeof p === "string") {
      // persist port as number if possible
      const asNum = Number(p);
      app.locals.kaelumConfig.port = Number.isNaN(asNum) ? p : asNum;
      if (typeof app.set === "function")
        app.set("kaelum:config", app.locals.kaelumConfig);
      console.log(
        `🔌 Port set to ${app.locals.kaelumConfig.port} in Kaelum config.`
      );
    }
  }

  // Return the full merged config for convenience
  return app.locals.kaelumConfig;
}

module.exports = setConfig;