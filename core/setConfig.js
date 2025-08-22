// core/setConfig.js
// Kaelum centralized configuration helper
// - merges provided options with existing runtime config
// - persists merged config on app (app.set('kaelum:config', cfg))
// - supports toggling bodyParser (removes or re-adds parsers tracked in app.locals)
// - applies cors and helmet when requested

const cors = require("cors");
const helmet = require("helmet");
const express = require("express");
const path = require("path");

function removeMiddlewareByRef(app, fnRef) {
  if (!app._router || !Array.isArray(app._router.stack)) return;
  for (let i = app._router.stack.length - 1; i >= 0; i--) {
    const layer = app._router.stack[i];
    if (layer && layer.handle === fnRef) {
      app._router.stack.splice(i, 1);
    }
  }
}

function isMiddlewarePresent(app, fnRef) {
  if (!app._router || !Array.isArray(app._router.stack)) return false;
  return app._router.stack.some((layer) => layer && layer.handle === fnRef);
}

/**
 * Apply configuration to Kaelum app instance.
 * @param {Object} app - Express app instance (Kaelum wrapper)
 * @param {Object} options - configuration options
 * @param {boolean|object} [options.cors] - enable CORS (true or options)
 * @param {boolean|object} [options.helmet] - enable Helmet (true or options)
 * @param {boolean} [options.bodyParser] - enable/disable default body parsing
 * @param {string} [options.static] - folder to serve static files from
 * @param {boolean|object} [options.logs] - enable logging (morgan)
 * @param {number} [options.port] - store desired port in config (start reads it)
 * @returns {Object} merged config
 */
function setConfig(app, options = {}) {
  // Merge existing config with new options
  const prev = app.get("kaelum:config") || app.locals.kaelumConfig || {};
  const cfg = Object.assign({}, prev, options);

  // Persist merged config
  app.locals.kaelumConfig = cfg;
  app.set("kaelum:config", cfg);

  // --- Body parser toggle ---
  // We rely on app.locals._kaelum_bodyparsers being set by createApp
  if (Object.prototype.hasOwnProperty.call(options, "bodyParser")) {
    const wanted = options.bodyParser;
    const parsers = app.locals._kaelum_bodyparsers || [];

    if (wanted === false) {
      // remove all parser references recorded earlier
      parsers.forEach((fn) => removeMiddlewareByRef(app, fn));
      // log for visibility
      console.log("⚙️  Kaelum: bodyParser disabled by configuration.");
    } else if (wanted === true) {
      // re-add them if missing
      parsers.forEach((fn) => {
        if (!isMiddlewarePresent(app, fn)) {
          app.use(fn);
        }
      });
      console.log("⚙️  Kaelum: bodyParser enabled by configuration.");
    }
  }

  // --- CORS ---
  if (Object.prototype.hasOwnProperty.call(options, "cors") && options.cors) {
    const corsOpts = options.cors === true ? {} : options.cors;
    app.use(cors(corsOpts));
    console.log("🛡️  CORS activated.");
  }

  // --- Helmet ---
  if (Object.prototype.hasOwnProperty.call(options, "helmet") && options.helmet) {
    const helmetOpts = options.helmet === true ? {} : options.helmet;
    app.use(helmet(helmetOpts));
    console.log("🛡️  Helmet activated.");
  }

  // --- Static (optional) ---
  if (Object.prototype.hasOwnProperty.call(options, "static") && options.static) {
    // serve static folder relative to project root
    const staticPath = path.resolve(process.cwd(), options.static);
    app.use(express.static(staticPath));
    console.log(`📁 Static files served from: ${staticPath}`);
  }

  // --- Logs (optional; uses morgan if available) ---
  if (Object.prototype.hasOwnProperty.call(options, "logs") && options.logs) {
    try {
      const morgan = require("morgan");
      const format =
        typeof options.logs === "object" && options.logs.format
          ? options.logs.format
          : "dev";
      app.use(morgan(format));
      console.log("📋 Morgan logging enabled.");
    } catch (err) {
      console.warn(
        "📋 Morgan is not installed. Install 'morgan' if you want logging (npm i morgan)."
      );
    }
  }

  // keep merged config available
  return cfg;
}

module.exports = setConfig;