// core/redirect.js
// Helper to register simple redirect routes in Kaelum.
// Usage: redirect(app, '/old', '/new', 302)
// Returns the app for chaining.

function redirect(app, fromPath, toPath, status = 302) {
  if (!app || typeof app.get !== "function") {
    throw new Error("Invalid app instance: cannot register redirect");
  }
  if (typeof fromPath !== "string" || typeof toPath !== "string") {
    throw new Error("redirect: fromPath and toPath must be strings");
  }

  const from = fromPath.startsWith("/") ? fromPath : "/" + fromPath;

  // Avoid duplicate registration: remove existing route with same path if present
  try {
    if (app._router && Array.isArray(app._router.stack)) {
      app._router.stack = app._router.stack.filter((layer) => {
        // keep layers that are not the same GET route
        if (!layer.route) return true;
        if (layer.route && layer.route.path === from) {
          // remove old route for same path (prevents duplicates)
          return false;
        }
        return true;
      });
    }
  } catch (e) {
    // If internal inspection fails, continue and add the new handler anyway
  }

  // Register a GET route that redirects
  app.get(from, (req, res) => {
    res.redirect(status, toPath);
  });

  return app;
}

module.exports = redirect;