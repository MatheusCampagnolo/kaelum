// core/apiRoute.js
// Provide a simple helper to create RESTful resource routes.
// Internally uses addRoute(app, basePath, handlers).
// - resource: string like 'users' or '/users'
// - handlers: function (assumed GET) or an object mapping methods and/or nested subpaths

const addRoute = require('./addRoute');

/**
 * Normalize resource into a base path string.
 * @param {string} resource
 * @returns {string} normalized path starting with '/'
 */
function normalizeResource(resource) {
  if (!resource) return '/';
  if (typeof resource !== 'string') {
    throw new Error('resource must be a string');
  }
  // trim trailing slash, ensure leading slash
  let r = resource.trim();
  if (!r.startsWith('/')) r = '/' + r;
  if (r.length > 1 && r.endsWith('/')) r = r.slice(0, -1);
  return r;
}

/**
 * apiRoute(app, resource, handlers)
 * @param {Object} app - Express app (Kaelum app)
 * @param {string} resource - resource name or path (e.g. 'users' or '/users')
 * @param {Function|Object} handlers - function or object with methods and/or nested subpaths
 */
function apiRoute(app, resource, handlers = {}) {
  if (!app || typeof app.use !== 'function') {
    throw new Error('Invalid app instance: cannot register apiRoute');
  }

  const basePath = normalizeResource(resource);

  // If handlers is a function, assume it's a GET on basePath
  if (typeof handlers === 'function') {
    addRoute(app, basePath, handlers);
    return;
  }

  // If handlers is not an object, throw
  if (!handlers || typeof handlers !== 'object') {
    throw new Error('Handlers must be a function or a plain object');
  }

  // Directly reuse addRoute: it supports method keys and nested '/:id' subpaths.
  addRoute(app, basePath, handlers);
}

module.exports = apiRoute;