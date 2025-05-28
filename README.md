# Kaelum

**Kaelum** is a minimalist Node.js framework designed to simplify the creation of web pages and REST APIs, especially for beginners. Inspired by Python's clean syntax and powered by Express.js, Kaelum automates project setup and server configuration with an intuitive CLI.

## 📦 Installation

You can create a new project with Kaelum using:

```bash
npx kaelum create
````

Then install dependencies and start your app:

```bash
cd my-project
npm install
npm start
```

> **Note:** No need to install Kaelum globally. `npx` handles it automatically!

---

## 🧠 Why Kaelum?

* 📂 Minimalist MVC folder structure
* ⚙️ Auto-configured Express setup
* 🔒 Built-in support for CORS and Helmet
* 🧱 Easy route management
* 🧪 Great for learning and building quick prototypes

---

## 📁 Web Template Structure

After running `npx kaelum create`, the web template structure looks like this:

```
my-web-app/
├── public/          # Static files (e.g., CSS, JS)
│   └── style.css
├── views/           # HTML templates
│   └── index.html
├── controllers/     # Page controller logic
│   └── .gitkeep
├── middlewares/     # Custom middlewares
│   └── example.js
├── routes.js        # Route definitions
├── app.js           # Server initialization
└── package.json     # Project metadata and dependencies
```

---

## 🚀 Features

Kaelum exposes simple utilities that make it easy to build a web server:

```js
const kaelum = require('kaelum');
const app = kaelum();
```

### 🌐 `addRoute(path, handlers)`

Add routes with GET, POST, PUT, DELETE handlers in one place.

```js
addRoute('/home', {
  get: (req, res) => res.send('GET: Welcome!'),
  post: (req, res) => res.send('POST: Data received!')
});
```

### 🔐 `setMiddleware(middleware)`

Globally apply middleware to all routes.

```js
setMiddleware(require('helmet')());
```

### 🚀 `start(port)`

Start the server.

```js
start(3000);
```

---

## 👨‍💻 Local Development (for contributors)

If you want to test or improve Kaelum locally:

```bash
git clone https://github.com/MatheusCampagnolo/kaelum.git
cd kaelum
npm link
```

Now you can run the CLI from anywhere:

```bash
npx kaelum create
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.