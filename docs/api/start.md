# start

Starts the Kaelum server. This is a wrapper around Express's `app.listen()`.

## Signature

```js
app.start([port], [callback])
```

### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `port` | `number` \| `string` | **Optional.** The port to listen on. |
| `callback` | `Function` | **Optional.** A function to call when the server starts. |

### Returns

Returns the `http.Server` instance.

## Port Precedence
The port is determined by checking sources in this order:

1.  **Explicit Argument**: `app.start(5000)`
2.  **Config**: `app.setConfig({ port: 4000 })`
3.  **Default**: `3000`

## Examples

### Basic usage
```js
app.start(); // listens on 3000 (or config port)
```

### Explicit port
```js
app.start(8080, () => {
  console.log('Server is running on 8080');
});
```

### Using Environment Variables
```js
const PORT = process.env.PORT || 3000;
app.start(PORT);
```

### Error Handling
The `start` function attaches a basic error listener to the server instance to log common errors (like `EADDRINUSE`) to the console.
