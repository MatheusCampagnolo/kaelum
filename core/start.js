// core/start.js
// Start helper for Kaelum: uses port passed or reads from Kaelum config, or falls back to 3000.

function start(app, port, cb) {
  if (!app) throw new Error("start requires an app instance");

  // If port omitted, try to read from Kaelum config
  let usePort = port;
  if (typeof usePort === "undefined" || usePort === null) {
    const cfg = app.get("kaelum:config") || app.locals.kaelumConfig || {};
    if (cfg && cfg.port) usePort = cfg.port;
  }
  // fallback default
  if (typeof usePort === "undefined" || usePort === null) usePort = 3000;

  // create server and store reference for possible later use
  const server = app.listen(usePort, () => {
    console.log(`🚀 Kaelum server running on port ${usePort}`);
    if (typeof cb === "function") cb();
  });

  // keep reference if needed
  if (!app.locals) app.locals = {};
  app.locals._kaelum_server = server;

  return server;
}

module.exports = start;