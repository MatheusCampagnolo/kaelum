// core/start.js
// start(app, port?, callback?) - read port from Kaelum config if not provided

function start(app, port, cb) {
  // allow start(app) or start(app, port) or start(app, port, cb)
  // If port is not a number, shift arguments
  let listenPort = port;
  let callback = cb;

  if (typeof port === 'function') {
    callback = port;
    listenPort = undefined;
  }

  const cfg = app.get('kaelum:config') || app.locals.kaelumConfig || {};
  if (typeof listenPort !== 'number') {
    listenPort = cfg.port || process.env.PORT || 3000;
  }

  const server = app.listen(listenPort, () => {
    console.log(`Server running on port ${listenPort}`);
    if (typeof callback === 'function') callback();
  });

  return server;
}

module.exports = start;