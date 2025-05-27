# Kaelum

**Kaelum** is a minimalist Node.js framework designed to simplify the creation of web pages and REST APIs, especially for beginners. Inspired by Python's clean syntax and powered by Express.js, Kaelum automates project setup and server features with an intuitive CLI.

## 🚧 Project Status

> Kaelum is currently under development and not yet published on npm.

## 📦 Installation

Kaelum is not yet published on npm, but you can link it locally for testing:

```bash
cd path/to/kaelum
npm link
````

Then use the CLI anywhere:

```bash
npx kaelum create
```

> 🔗 After generating a project, you'll need to link the framework in the generated folder:

```bash
npm link kaelum
```

## 🔧 Usage Example

Here’s an example of how a Kaelum project looks after generation:

**`app.js`**

```js
const kaelum = require("kaelum");
const app = kaelum();

const routes = require("./routes");
routes(app);

app.start(3000);
```

**`routes.js`**

```js
function Routes(app) {
  app.addRoute("/", {
    get: (req, res) => res.send("Hello from GET /"),
    post: (req, res) => res.send("Hello from POST /")
  });

  // Example route using middleware
  app.addRoute("/admin", {
    get: [
      (req, res, next) => {
        console.log("Middleware on /admin");
        next();
      },
      
      (req, res) => res.send("Admin Page")
    ]
  });
}

module.exports = Routes;
```

This demonstrates the use of:

* `addRoute`: Simplified route creation.
* Middleware support directly in routes.
* `start`: Server start abstraction.
* Static file support (through `public/` folder).

## 📁 Web Template Structure

When generating a **web** project, the initial structure is:

```
my-web-app/
├── public/          # Static files (e.g., CSS, JS)
│   └── style.css
├── views/           # HTML templates
│   └── index.html
├── controllers/     # Page controller logic
│   └── .gitkeep
├── middlewares/     # Custom middlewares
│   └── logger.js   # An Example of a possible middleware
├── routes.js        # Route definitions
├── app.js           # Server initialization
└── package.json     # Project metadata and dependencies
```

> The homepage already comes with an HTML+CSS welcome screen inspired by React's first page.

## 🚀 CLI Usage

The Kaelum CLI helps you create projects in seconds:

```bash
npx kaelum create
```

You'll be prompted to choose a template (currently only "web" is available). It will scaffold a ready-to-run project using the Kaelum structure.

Then:

```bash
cd my-project
npm install
npm link kaelum
npm start
```

## 🔮 Future Roadmap

* API template support
* Advanced configuration with `setConfig`
* Validation helpers
* JWT Authentication module
* File-based routing (optional)

## 🤝 Contributing

> Contribution guidelines will be added soon. Until then, feel free to fork and explore!

## 📌 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
