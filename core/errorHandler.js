// core/errorHandler.js
// Generic error handling middleware factory for Kaelum.
//
// Usage:
//   const { errorHandler } = require('./core/errorHandler');
//   app.use(errorHandler({ exposeStack: false }));
//
// The middleware responds with JSON:
//   { error: { message: "...", code: "SOME_CODE" [, stack: "..." ] } }
// - status is taken from err.status or err.statusCode or defaults to 500
// - err.code is used if present; otherwise "INTERNAL_ERROR"

function errorHandler(options = {}) {
  const { exposeStack = false } = options;

  return function (err, req, res, next) {
    // If headers already sent, delegate to default Express handler
    if (res.headersSent) {
      return next(err);
    }

    const status = (err && (err.status || err.statusCode)) ? (err.status || err.statusCode) : 500;

    const payload = {
      error: {
        message: (err && err.message) ? err.message : 'Internal Server Error',
        code: (err && err.code) ? err.code : 'INTERNAL_ERROR'
      }
    };

    if (exposeStack && err && err.stack) {
      payload.error.stack = err.stack;
    }

    // Server-side logging: errors 5xx -> console.error, others -> console.warn
    if (status >= 500) {
      // prefer stack if available
      if (err && err.stack) console.error(err.stack);
      else console.error(err);
    } else {
      if (err && err.message) console.warn(err.message);
      else console.warn(err);
    }

    res.status(status).json(payload);
  };
}

module.exports = { errorHandler };