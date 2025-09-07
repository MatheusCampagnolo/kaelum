# Kaelum

**Kaelum.JS** — Minimalist Node.js framework to simplify creation of web pages and REST APIs.  
Designed for students and developers who want a fast, opinionated project scaffold and a small, friendly API that encapsulates common Express.js boilerplate.

---

## 🚀 Quick start

Create a new project (interactive):

```bash
npx kaelum create
````

Or create non-interactively (project name + template):

```bash
npx kaelum create my-app --template web
# or
npx kaelum create my-api --template api
```

Then:

```bash
cd my-app
npm install
npm start
```

> No need to install Kaelum globally — `npx` handles execution.

---

## 📦 What Kaelum provides

* CLI that scaffolds a ready-to-run project (Web or API template) using an opinionated **MVC** structure.
* Thin abstraction layer over **Express.js** that:

  * automates JSON / URL-encoded parsing by default,
  * automatically configures common security middlewares via `setConfig` (CORS, Helmet),
  * exposes a small, easy-to-learn API for routes, middleware and configuration.
* Small set of helpers for common tasks: `start`, `addRoute`, `apiRoute`, `setConfig`, `static`, `redirect`, `healthCheck`, `useErrorHandler`, and more.

Kaelum aims to reduce the initial setup burden while keeping flexibility for advanced users.

---

## 📁 Template structures

### Web template (created by `npx kaelum create <name>` with template `web`)

```
my-web-app/
├── public/          # Static files (CSS, JS)
│   └── style.css
├── views/           # HTML templates
│   └── index.html
├── controllers/     # Controller logic (MVC)
│   └── .gitkeep
├── middlewares/     # Custom middlewares
│   └── logger.js
├── routes.js        # Route definitions (example uses Kaelum helpers)
├── app.js           # Server initialization (uses Kaelum API)
└── package.json
```

### API template (`--template api`)

```
my-api-app/
├── controllers/
│   └── userController.js
├── middlewares/
│   └── logger.js
├── routes.js
├── app.js
└── package.json
```

---

## 🧩 Core API (examples — CommonJS)

> Kaelum exposes a factory — use `require('kaelum')` and call it to get an app instance:

```js
const kaelum = require('kaelum');
const app = kaelum();
```

### `app.setConfig(options)`

Enable/disable common features:

```js
app.setConfig({
  cors: true,         // apply CORS (requires cors package in dependencies)
  helmet: true,       // apply Helmet
  static: "public",   // serve static files from "public"
  bodyParser: true,   // default: enabled (JSON + urlencoded)
  logs: false,        // enable request logging via morgan (if installed)
  port: 3000          // prefered port (used when calling app.start() without port)
});
```

* `setConfig` persists settings to the Kaelum config and will install/remove Kaelum-managed middlewares.
* Kaelum enables JSON/urlencoded parsing by default so beginners won't forget to parse request bodies.

---

### `app.start(port, callback)`

Starts the HTTP server. If `port` is omitted, Kaelum reads `port` from `setConfig` or falls back to `3000`.

```js
app.start(3000, () => console.log('Running'));
```

---

### `app.addRoute(path, handlers)` and `app.apiRoute(resource, handlers)`

Register routes easily:

```js
app.addRoute('/home', {
  get: (req, res) => res.send('Welcome!'),
  post: (req, res) => res.send('Posted!')
});

// apiRoute builds RESTy resources with nested subpaths:
app.apiRoute('users', {
  get: listUsers,
  post: createUser,
  '/:id': {
    get: getUserById,
    put: updateUser,
    delete: deleteUser
  }
});
```

`addRoute` also accepts a single handler function (assumed `GET`).

---

### `app.setMiddleware(...)`

Flexible helper to register middleware(s):

```js
// single middleware
app.setMiddleware(require('helmet')());

// array of middlewares
app.setMiddleware([mw1, mw2]);

// mount middleware on a path
app.setMiddleware('/admin', authMiddleware);
```

---

### `app.redirect(from, to, status)`

Register a redirect route:

```js
app.redirect('/old-url', '/new-url', 302);
```

---

### `app.healthCheck(path = '/health')`

Adds a health endpoint returning `{ status: 'OK', uptime, timestamp, pid }`.

---

### `app.useErrorHandler(options)`

Attach Kaelum's default JSON error handler:

```js
app.useErrorHandler({ exposeStack: false });
```

It will return standardized JSON for errors and log server-side errors (5xx) to `console.error`.

---

## 🔧 Local development & contributing

To develop Kaelum locally and test the CLI:

```bash
# clone
git clone https://github.com/<your-repo>/kaelum.git
cd kaelum

# install & link locally
npm install
npm link

# from any folder you can now run the CLI
npx kaelum create my-test --template web
# or
kaelum create my-test    # if linked globally
```

---


## 📝 Why Kaelum?

* Reduces repetitive boilerplate required to start Node/Express web projects.
* Opinionated scaffolding (MVC) helps beginners adopt better structure.
* Keeps a small API surface: easy to teach and document.
* Extensible — `setConfig` and middleware helpers allow adding features without exposing Express internals.

---

## ✅ Current status

> Kaelum is under active development. The CLI scaffolds web and API templates and the framework already includes the MVP helpers (`start`, `addRoute`, `apiRoute`, `setConfig`, `static`, `redirect`, `healthCheck`, `useErrorHandler`) and security toggles for `cors` and `helmet`.

---

## 📚 Links

* GitHub: `https://github.com/MatheusCampagnolo/kaelum`
* npm: `https://www.npmjs.com/package/kaelum`

---

## 🧾 License

MIT — see [LICENSE](LICENSE).

---

## ✍️ Notes for maintainers

* Templates include `package.json` configured as `commonjs` for now (uses `require`/`module.exports`).
* Update template `package.json` dependencies to reference Kaelum version when releasing new npm versions.
* We plan to add full JSDoc for the public API, unit tests (Jest + Supertest) and a docs site in future iterations.