// core/healthCheck.js
// Simple health-check route helper for Kaelum.
// Usage: registerHealth(app, '/health')

/**
 * Register a health-check endpoint.
 * @param {Object} app - Express/Kaelum app instance
 * @param {string} routePath - route path (default '/health')
 */
function registerHealth(app, routePath = "/health") {
  if (!app || typeof app.get !== "function") {
    throw new Error("Invalid app instance: cannot register health check");
  }

  const p =
    typeof routePath === "string"
      ? routePath.startsWith("/")
        ? routePath
        : "/" + routePath
      : "/health";

  // Remove any previous handler for the same path if present to avoid duplication.
  // We'll be conservative and not remove other handlers globally.
  try {
    // If there is already an identical layer, skip adding another.
    const existing =
      app._router && Array.isArray(app._router.stack)
        ? app._router.stack.find(
            (layer) =>
              layer.route &&
              layer.route.path === p &&
              layer.route.methods &&
              layer.route.methods.get
          )
        : null;
    if (existing) return;
  } catch (e) {
    // ignore internal inspection failures and proceed to register
  }

  app.get(p, (req, res) => {
    res.json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: Date.now(),
      pid: process.pid,
      env: process.env.NODE_ENV || "development",
    });
  });
}

module.exports = registerHealth;