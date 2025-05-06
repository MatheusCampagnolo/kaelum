# Kaelum

**Kaelum** is a minimalist Node.js framework designed to simplify the creation of web pages and REST APIs, especially for beginners. Inspired by Python's clean syntax and powered by Express.js, Kaelum automates project setup and server features with an intuitive CLI.

## 🚧 Project Status

> Kaelum is currently under development and not yet published on npm.

## 💻 Local Development

To test Kaelum locally, clone the repository and link the CLI globally:

```bash
cd path/to/kaelum
npm link
````

Now you can use the CLI anywhere:

```bash
npx kaelum create
```

After creating your template, to test Kaelum, at the moment, it'll require to:
```bash
npm link kaelum
```
On the root of the created template.

## 📁 Web Template Structure

When you generate a web project, this is the initial structure at the moment:

```
my-web-app/
├── public/          # Static files (e.g., CSS, JS)
│   └── style.css
├── views/           # HTML templates
│   └── index.html
├── controllers/     # Page controller logic
│   └── .gitkeep
├── middlewares/     # Custom middlewares
│   └── .gitkeep
├── routes.js        # Route definitions
├── app.js           # Server initialization
└── package.json     # Project metadata and dependencies
```

## 🛠 Usage (after MVP implementation)

Once core features are implemented, the following will be available:

```js
import { start, addRoute, setMiddleware } from "kaelum";
```

These utilities will streamline server creation and route management.

## 📌 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.