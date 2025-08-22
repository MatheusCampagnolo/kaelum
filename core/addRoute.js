// core/addRoute.js
// Adds routes to an Express app using a flexible handlers object
// Supports:
// - handlers as a single function (assumed GET)
// - handlers as an object with HTTP methods (get, post, put, delete, patch, all)
// - nested subpaths as keys beginning with '/' (e.g. '/:id': { get: fn })

const supportedMethods = ['get', 'post', 'put', 'delete', 'patch', 'all'];

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}

/**
 * Registers routes on the provided Express app.
 * @param {Object} app - Express app instance
 * @param {string} basePath - base route path (e.g. '/users')
 * @param {Function|Object} handlers - single handler function or object map of handlers
 */
function addRoute(app, basePath, handlers = {}) {
  if (!app || typeof app.use !== 'function') {
    throw new Error('Invalid app instance: cannot register routes');
  }

  if (typeof basePath !== 'string') {
    throw new Error('Invalid path: basePath must be a string');
  }

  // If handlers is a single function, register it as GET
  if (typeof handlers === 'function') {
    app.get(basePath, handlers);
    return;
  }

  if (!isPlainObject(handlers)) {
    throw new Error('Handlers must be a function or a plain object');
  }

  // Iterate keys of handlers
  for (const key of Object.keys(handlers)) {
    const value = handlers[key];

    // Nested subpath (key starts with '/')
    if (key.startsWith('/')) {
      const subPath = basePath.endsWith('/')
        ? basePath.slice(0, -1) + key
        : basePath + key;

      // If nested value is a function -> assume GET
      if (typeof value === 'function') {
        app.get(subPath, value);
        continue;
      }

      // If nested value is object -> iterate methods
      if (isPlainObject(value)) {
        for (const method of Object.keys(value)) {
          const handlerFn = value[method];
          const m = method.toLowerCase();
          if (!supportedMethods.includes(m)) {
            throw new Error(`Unsupported HTTP method "${method}" for route "${subPath}"`);
          }
          if (typeof handlerFn !== 'function') {
            throw new Error(`Handler for ${method} ${subPath} must be a function`);
          }
          app[m](subPath, handlerFn);
        }
        continue;
      }

      throw new Error(`Invalid handler for nested path "${subPath}"`);
    }

    // Top-level method keys (like 'get', 'post', 'all', etc.)
    const m = key.toLowerCase();
    if (!supportedMethods.includes(m)) {
      throw new Error(`Unsupported key "${key}" in handlers for path "${basePath}"`);
    }
    const fn = handlers[key];
    if (typeof fn !== 'function') {
      throw new Error(`Handler for ${m.toUpperCase()} ${basePath} must be a function`);
    }
    app[m](basePath, fn);
  }
}

module.exports = addRoute;