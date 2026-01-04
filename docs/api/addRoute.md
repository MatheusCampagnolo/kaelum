# addRoute

Registers routes on the Kaelum application. This is the core routing function that powers `apiRoute` and other helpers.

## Signature

```js
app.addRoute(path, handlers)
```

### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `path` | `string` | The route path (e.g., `'/'`, `'/users'`, `'/items/:id'`). |
| `handlers` | `Function` \| `Object` \| `Array` | The logic to handle requests. See patterns below. |

## Usage Patterns

### 1. Simple GET Handler
If `handlers` is a single function, it is treated as a **GET** request handler.

```js
app.addRoute('/hello', (req, res) => {
  res.send('Hello World');
});
```

### 2. Method Mapping
Pass an object to handle multiple HTTP methods for the same path.

```js
app.addRoute('/users', {
  get: (req, res) => { /* list users */ },
  post: (req, res) => { /* create user */ }
});
```

Supported methods: `get`, `post`, `put`, `delete`, `patch`, `all`.

### 3. Middleware Chains
Any handler can be an array of functions (middleware chain).

```js
const checkAuth = (req, res, next) => { /* ... */ next(); };

app.addRoute('/dashboard', {
  get: [checkAuth, (req, res) => {
    res.send('Secure Dashboard');
  }]
});
```

### 4. Nested Sub-routes
You can define sub-routes by using keys that start with `/`.

```js
app.addRoute('/api', {
  // GET /api
  get: (req, res) => res.send('API Root'),

  // Nested: /api/status
  '/status': {
    get: (req, res) => res.json({ status: 'ok' })
  }
});
```

## Error Handling
Kaelum wraps all handlers in a try/catch block automatically. Async errors (promise rejections) are caught and passed to Express's `next(err)`, so you don't need manual try/catch for every async operation.
