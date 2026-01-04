# apiRoute

A high-level helper for creating RESTful API resources quickly. It simplifies route registration for standard CRUD operations.

## Signature

```js
app.apiRoute(resource, handlers)
```

### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `resource` | `string` | The resource name or path (e.g., `'users'`, `'/posts'`). |
| `handlers` | `Object` \| `Boolean` | The handler map or a boolean `true` to generate stubs. |

## Usage Patterns

### 1. Manual CRUD Mapping
map standard controller functions to REST actions.

```js
app.apiRoute('users', {
  get: (req, res) => { /* list */ },
  post: (req, res) => { /* create */ },
  
  // sub-resource /users/:id
  '/:id': {
    get: (req, res) => { /* get by id */ },
    put: (req, res) => { /* update */ },
    delete: (req, res) => { /* delete */ }
  }
});
```

### 2. Auto-generated Stubs
Pass `true` to generate "Not Implemented" stubs for all standard CRUD operations. Useful for scaffolding.

```js
app.apiRoute('todos', true);
```

This acts as if you provided 501 handlers for:
- `GET /todos`
- `POST /todos`
- `GET /todos/:id`
- `PUT /todos/:id`
- `DELETE /todos/:id`

### 3. CRUD Shorthand
You can pass an object with a `crud` key containing named handlers (`list`, `create`, `show`, `update`, `remove`).

```js
const userController = {
  list: (req, res) => res.json([]),
  create: (req, res) => res.status(201).send('Created'),
  show: (req, res) => res.json({ id: req.params.id }),
  // ... update, remove
};

app.apiRoute('users', { crud: userController });
```

Any missing CRUD functions will default to 501 Not Implemented.

## Path Handling
The `resource` argument is automatically normalized:
- `'users'` becomes `'/users'`
- `'/api/v1/posts'` remains `'/api/v1/posts'`

It internally calls `addRoute`, so all features of `addRoute` (middleware chains, etc.) are available.
