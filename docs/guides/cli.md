# Kaelum CLI

The **Kaelum CLI** is the command-line tool to quickly create new Kaelum projects with a **consistent structure**, **ready-to-use templates**, and pre-configured scripts.

**Main goal:** Automate project setup, reduce repetitive steps, and let developers focus on building features.

**Suitable for:**

- **Beginners** – guided interactive prompts help configure projects correctly.
- **Advanced developers** – initialize multiple projects or integrate into automation scripts.


## Why use the Kaelum CLI

Creating a Kaelum project manually involves many repetitive tasks:

- Creating folders (`middlewares/`, `routes.js`, `views/`)
- Copying boilerplate files
- Updating `package.json` with scripts and metadata
- Installing dependencies (`express`, `cors`, `helmet`)

The CLI automates all of this:

- **Interactive prompts** for project name and template selection
- **Web and API templates** ready for development
- **Automatic updates** to scripts, configuration, and project metadata

<details>
<summary>Behind the scenes</summary>

- Uses `fs-extra` to copy files safely
- Prevents overwriting existing directories
- Automatically updates `package.json`
- Templates include middleware, static files, views, and default routes

</details>


## CLI Usage

### Interactive Mode

```bash
npx kaelum create
```

- Starts a **guided interactive flow** asking for project name and template.
- Validates input and ensures folder availability.

### Direct Template Mode

```bash
npx kaelum create my-app --template web
```

- Skips interactive prompts.
- Immediately creates the project with the chosen template.
- Useful for **automation or scripts**.

::: code-group

```bash [Interactive Mode]
npx kaelum create
```

```bash [Direct Template - Web]
npx kaelum create my-web-app --template web
```

```bash [Direct Template - API]
npx kaelum create my-api-app --template api
```

:::


## A Closer Look at the CLI Flow

Here’s what happens, step by step, when you run the `npx kaelum create` command.

::: info

### Step 1: Start the CLI 🚀

You start the process with a single command. The CLI then loads the available templates and prepares the interactive questions.

```bash
npx kaelum create
```

:::

::: info

### Step 2: Choose a project name

The CLI will ask for your project's name. This name will also be used for the folder.
:::

::: warning

### Common Error: Folder Already Exists

If a folder with the chosen name already exists, the CLI will stop to prevent accidental overwrites.

```text
❌ The folder "my-web-app" already exists. Choose another name or remove the folder.
```

Simply remove the existing folder or run the command again with a different name.
:::

::: info

### Step 3: Select a template

You'll be prompted to choose between the available templates. Each one is tailored for a specific use case.

- **Web**: For multi-page websites with static files.
- **API**: For building a RESTful API backend.
  :::

::: info

### Step 4: File generation

This is where the magic happens. The CLI automatically:

- Creates the project folder structure.
- Copies all the necessary boilerplate files.
- Updates the `package.json` with the project name, scripts, and dependencies.
  :::

::: tip

### Step 5: Success\! ✅

Once finished, you'll see a success message with the next steps to get your server running.

```text
✅ Project "my-app" created successfully!

Next steps:
  cd my-app
  npm install
  npm run dev
```

:::

::: tip

### Step 6: Ready to code 🎉

Your new Kaelum project is fully structured and configured. You can now open the folder in your code editor and start building\!
:::


## Template Overview

### Web Template

- **Suitable for**: Multi-page websites, projects serving static files (`css`, `js`, `images`).
- **Includes**: `public/`, `views/`, and basic middleware configuration.

::: code-group

```text [Folder Structure]
my-web-app/
├─ app.js
├─ routes.js
├─ middlewares/
├─ controllers/
├─ views/
└─ public/
```

```js [Example Route]
// routes.js
app.addRoute("/", {
  get: (req, res) => res.send("Welcome!"),
  post: (req, res) => res.send("Posted!"),
});
```

:::

### API Template

- **Suitable for**: Building RESTful APIs.
- **Features**: Pre-configured structure for CRUD endpoints and nested paths.

::: code-group

```text [Folder Structure]
my-api/
├─ app.js
├─ routes.js
├─ middlewares/
└─ controllers/
```

```js [Example Route]
// routes.js
app.apiRoute("users", {
  get: (req, res) => res.json([{ id: 1, name: "Alice" }]),
  post: (req, res) => res.status(201).json({ id: 2, name: "Bob" }),
  "/:id": {
    get: (req, res) => res.json({ id: req.params.id }),
  },
});
```

:::


## Common Issues

Here are a few quick solutions for problems you might encounter while using the Kaelum CLI.

::: details "npx: command not found"
This error means Node.js and npm are likely not installed or not available in your system's PATH. Please install the latest LTS version of [Node.js](https://nodejs.org/) and try again.
:::

::: details "Error: EPERM: operation not permitted"
This is a permissions issue. It usually happens if you try to create a project inside a restricted folder (like `C:\Windows`). Make sure you are running the command in a folder where you have write permissions, such as your user's home directory or a dedicated projects folder.
:::

::: info Looking for more help?
For more solutions and other common problems, please visit our complete troubleshooting guide.

[Go to Troubleshooting Guide](/guides/troubleshooting)
:::


## Best Practices

- Use **interactive mode** for first-time setup or when exploring features.
- Use **direct template mode** for CI/CD pipelines, automation scripts, or when you know exactly what you want.
- Keep your global `kaelum` package updated to get the latest features and template improvements.


## Summary

The Kaelum CLI provides a **guided, visual, and error-proof** way to bootstrap new projects:

- Interactive prompts for beginners.
- Direct template mode for quick setup.
- Ready-to-use Web and API templates.
- Consistent folder structure and scripts.

It bridges the gap between **project setup and productive development**, letting you focus on building great applications.
