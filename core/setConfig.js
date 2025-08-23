// core/setConfig.js
// Kaelum centralized configuration helper.
// - Supports toggling CORS, Helmet, static folder, Morgan logs, bodyParser, and port.
// - Persists merged config to app locals (app.set("kaelum:config", ...)).

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
 */
function persistConfig(app, options = {}) {
  const prev = app.locals.kaelumConfig || {};
  const merged = Object.assign({}, prev, options);
  app.locals.kaelumConfig = merged;
  app.set("kaelum:config", merged);
  return merged;
}

/**
 * Remove a middleware function reference from express stack
 * @param {Object} app
 * @param {Function} fn
 */
function removeMiddlewareByFn(app, fn) {
  if (!app || !app._router || !Array.isArray(app._router.stack)) return;
  app._router.stack = app._router.stack.filter((layer) => layer.handle !== fn);
}

/**
 * Remove static middleware previously installed by Kaelum (if any)
 * @param {Object} app
 */
function removeKaelumStatic(app) {
  const prev = app.locals && app.locals._kaelum_static;
  if (prev) {
    removeMiddlewareByFn(app, prev);
    app.locals._kaelum_static = null;
  }
}

/**
 * Remove body parsers previously installed by Kaelum
 * @param {Object} app
 */
function removeKaelumBodyParsers(app) {
  const arr = app.locals && app.locals._kaelum_bodyparsers;
  if (Array.isArray(arr)) {
    arr.forEach((fn) => removeMiddlewareByFn(app, fn));
    app.locals._kaelum_bodyparsers = [];
  }
}

/**
 * Remove morgan logger if previously set
 * @param {Object} app
 */
function removeKaelumLogger(app) {
  const prev = app.locals && app.locals._kaelum_logger;
  if (prev) {
    removeMiddlewareByFn(app, prev);
    app.locals._kaelum_logger = null;
  }
}

/**
 * Apply configuration options to the app
 * @param {Object} app - express app instance
 * @param {Object} options - supported keys: cors, helmet, static, logs, port, bodyParser
 */
function setConfig(app, options = {}) {
  if (!app) throw new Error("setConfig requires an app instance");

  // persist/merge config
  const cfg = persistConfig(app, options);

  // --- CORS ---
  if (options.hasOwnProperty("cors")) {
    if (options.cors) {
      const cors = tryRequire("cors");
      const corsOpts = options.cors === true ? {} : options.cors;
      if (!cors) {
        console.warn(
          "Kaelum: cors package not installed. Skipping CORS setup."
        );
      } else {
        // remove previous cors if exists (we can't easily find it by fn, so we rely on setConfig being idempotent)
        // For safety, do not try to remove every cors instance — assume user calls setConfig once
        app.use(cors(corsOpts));
        console.log("🛡️  CORS activated.");
      }
    } else {
      // If false, we can't reliably remove community middleware, but attempt to remove Kaelum-installed ones.
      // No-op if not installed.
      // (Note: if user installed cors manually, we won't remove it.)
    }
  }

  // --- Helmet ---
  if (options.hasOwnProperty("helmet")) {
    if (options.helmet) {
      const helmet = tryRequire("helmet");
      const helmetOpts = options.helmet === true ? {} : options.helmet;
      if (!helmet) {
        console.warn(
          "Kaelum: helmet package not installed. Skipping Helmet setup."
        );
      } else {
        app.use(helmet(helmetOpts));
        console.log("🛡️  Helmet activated.");
      }
    } else {
      // No-op for manual removals currently.
    }
  }

  // --- Static folder handling ---
  if (options.hasOwnProperty("static")) {
    // remove previous Kaelum static
    removeKaelumStatic(app);

    if (options.static) {
      const expressStatic =
        tryRequire("express").static || require("express").static;
      // resolve to absolute path relative to project root if necessary
      const dir =
        typeof options.static === "string"
          ? path.resolve(process.cwd(), options.static)
          : path.join(process.cwd(), "public");
      const staticFn = expressStatic(dir);
      app.locals._kaelum_static = staticFn;
      app.use(staticFn);
      console.log(`📁 Static files served from ${dir}`);
    } else {
      // static === false -> nothing to add (static removed)
      console.log("📁 Static serving disabled.");
    }
  }

  // --- Body parser toggle ---
  if (options.hasOwnProperty("bodyParser")) {
    if (options.bodyParser === false) {
      // remove Kaelum-installed body parsers
      removeKaelumBodyParsers(app);
      console.log("📦 Body parsers disabled.");
    } else {
      // ensure body parsers are installed (if not present)
      if (
        !app.locals._kaelum_bodyparsers ||
        app.locals._kaelum_bodyparsers.length === 0
      ) {
        const jsonParser = tryRequire("express").json();
        const urlencodedParser = tryRequire("express").urlencoded({
          extended: true,
        });
        app.locals._kaelum_bodyparsers = [jsonParser, urlencodedParser];
        app.use(jsonParser);
        app.use(urlencodedParser);
        console.log("📦 Body parsers enabled (JSON + URL-encoded).");
      }
    }
  }

  // --- Logs (morgan) ---
  if (options.hasOwnProperty("logs")) {
    // remove previous logger first
    removeKaelumLogger(app);

    if (options.logs) {
      const morgan = tryRequire("morgan");
      if (!morgan) {
        console.warn("Kaelum: morgan package not installed. Skipping logs.");
      } else {
        // simple dev format by default; could be configured
        const logger = morgan("dev");
        app.locals._kaelum_logger = logger;
        app.use(logger);
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
      app.set("kaelum:config", merged);
      console.log("🔌 Port preference cleared from Kaelum config.");
    } else if (typeof p === "number" || typeof p === "string") {
      // persist port as number if possible
      const asNum = Number(p);
      app.locals.kaelumConfig.port = Number.isNaN(asNum) ? p : asNum;
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