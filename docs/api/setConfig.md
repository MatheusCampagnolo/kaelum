# setConfig

Configures global application settings such as security headers, logging, and static file serving.

## Signature

```js
app.setConfig(options)
```

### Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| `options` | `Object` | Configuration object with keys supported below. |

## Supported Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `port` | `number` | `3000` | Port to listen on when `app.start()` is called without arguments. |
| `cors` | `boolean` \| `Object` | `false` | Enables CORS. Pass `true` for defaults or an object for `cors` package options. |
| `helmet` | `boolean` \| `Object` | `false` | Enables Helmet security headers. Pass `true` or options. |
| `logs` | `boolean` | `false` | Enables HTTP request logging (via `morgan`). |
| `bodyParser` | `boolean` | `true` | Enables/disables JSON and URL-encoded body parsing. |
| `static` | `string` \| `boolean` | `false` | Path to serve static files from (e.g., `'public'`). |

## Examples

### Basic Setup
```js
app.setConfig({
  port: 8080,
  logs: true,
  static: 'public'
});
```

### Security Extensions
```js
app.setConfig({
  cors: { origin: 'https://example.com' }, // limits CORS to one domain
  helmet: true,                            // standard security headers
  bodyParser: false                        // disable if you want custom parsing
});
```

### Toggling Features
Calling `setConfig` merges with existing config. You can disable features by setting them to `false`.

```js
// previously enabled logs
app.setConfig({ logs: false }); // disables logging middleware
```
