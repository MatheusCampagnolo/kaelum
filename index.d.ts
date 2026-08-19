import { Express, RequestHandler, ErrorRequestHandler } from "express";
import { Server } from "http";

interface KaelumConfig {
  cors?: boolean | object;
  helmet?: boolean | object;
  static?: string | false;
  logs?: string | boolean;
  bodyParser?: boolean;
  port?: number;
  views?: { engine?: string; path?: string };
  logger?: boolean | false;
  gracefulShutdown?: boolean | GracefulShutdownConfig;
  rateLimit?: boolean | RateLimitConfig;
}

interface HealthOptions {
  path?: string;
  method?: string;
  replace?: boolean;
  readinessCheck?: (req?: any) => Promise<{ ok: boolean; details?: object }> | { ok: boolean; details?: object };
  include?: {
    uptime?: boolean;
    pid?: boolean;
    env?: boolean;
    timestamp?: boolean;
    metrics?: boolean;
  };
}

interface ErrorHandlerOptions {
  exposeStack?: boolean;
  logger?: ((err: Error, req: any, info?: object) => void) | false;
  onError?: (err: Error, req: any, res: any) => void;
}

interface GracefulShutdownConfig {
  /** Timeout in milliseconds before forcing shutdown (default: 10000) */
  timeout?: number;
  /** Process signals to handle (default: ["SIGTERM", "SIGINT"]) */
  signals?: string[];
}

interface RateLimitConfig {
  /** Window duration in ms (default: 900000 = 15 min) */
  windowMs?: number;
  /** Max requests per window per key (default: 100) */
  max?: number;
  /** Response body when rate limited */
  message?: string | object;
  /** HTTP status when rate limited (default: 429) */
  statusCode?: number;
  /** Custom key generator (default: req.ip) */
  keyGenerator?: (req: any) => string;
  /** Skip rate limiting for certain requests */
  skip?: (req: any) => boolean;
  /** Send standard rate-limit headers (default: true) */
  headers?: boolean;
  /** Custom store (must implement increment, resetKey, shutdown) */
  store?: {
    increment(key: string): { totalHits: number; resetTime: number };
    resetKey(key: string): void;
    shutdown(): void;
  };
}

interface RedirectEntry {
  path: string;
  to: string;
  status: number;
}

interface RequestIdOptions {
  /** Header name (default 'X-Request-Id') */
  headerName?: string;
  /** Custom ID generator function (default crypto.randomUUID) */
  generator?: () => string;
}

interface TimingOptions {
  /** Header name (default 'Server-Timing') */
  headerName?: string;
  /** Decimal places for duration in ms (default 2) */
  precision?: number;
}

interface MiddlewareEntry {
  path: string | null;
  handler: RequestHandler;
}

interface RouteHandlers {
  get?: RequestHandler | RequestHandler[];
  post?: RequestHandler | RequestHandler[];
  put?: RequestHandler | RequestHandler[];
  delete?: RequestHandler | RequestHandler[];
  patch?: RequestHandler | RequestHandler[];
  head?: RequestHandler | RequestHandler[];
  options?: RequestHandler | RequestHandler[];
  all?: RequestHandler | RequestHandler[];
  [subpath: string]: any;
}

/** Plugin function signature */
type KaelumPlugin = (app: KaelumApp, options?: Record<string, any>) => void;

/** A route group created by app.group() — scoped to a URL prefix */
interface KaelumGroup {
  /** The normalised prefix this group is mounted at */
  readonly prefix: string;

  /** The underlying Express Router instance */
  readonly router: any;

  /** Register routes within this group (paths relative to group prefix) */
  addRoute(path: string, handlers: RouteHandlers | RequestHandler | RequestHandler[]): KaelumGroup;

  /** Register RESTful API routes within this group */
  apiRoute(resource: string, handlers: RouteHandlers | RequestHandler | boolean): KaelumGroup;

  /** Register redirect route(s) within this group */
  redirect(from: string, to: string, status?: number): KaelumGroup;
  redirect(map: Record<string, string>): KaelumGroup;

  /** Register a health check endpoint within this group */
  healthCheck(pathOrOptions?: string | HealthOptions, options?: HealthOptions): KaelumGroup;

  /** Create a nested sub-group under this group */
  group(subPrefix: string, ...middleware: RequestHandler[]): KaelumGroup;
}

interface KaelumApp extends Express {
  /** Configure Kaelum features (cors, helmet, static, logs, etc.) */
  setConfig(options: KaelumConfig): KaelumConfig;

  /** Get the current Kaelum configuration */
  getKaelumConfig(): KaelumConfig;

  /** Start the HTTP server */
  start(port?: number, cb?: () => void): Server;

  /** Register routes with a flexible handler object */
  addRoute(path: string, handlers: RouteHandlers | RequestHandler | RequestHandler[]): void;

  /** Register RESTful API routes for a resource */
  apiRoute(resource: string, handlers: RouteHandlers): void;
  apiRoute(resource: string, handler: RequestHandler): void;
  apiRoute(resource: string, crud: true): void;

  /** Register middleware (optionally scoped to a path) */
  setMiddleware(middleware: RequestHandler | RequestHandler[]): MiddlewareEntry[];
  setMiddleware(path: string, middleware: RequestHandler | RequestHandler[]): MiddlewareEntry[];

  /** Remove Kaelum-tracked middleware. Optionally scoped to a path. */
  removeMiddleware(path?: string): MiddlewareEntry[];

  /** List all Kaelum-tracked middleware entries */
  getMiddleware(): MiddlewareEntry[];

  /** Register a health check endpoint */
  healthCheck(path?: string): KaelumApp;
  healthCheck(options?: HealthOptions): KaelumApp;
  healthCheck(path: string, options: HealthOptions): KaelumApp;

  /** Register redirect route(s) */
  redirect(from: string, to: string, status?: number): RedirectEntry[] | null;
  redirect(map: Record<string, string>): RedirectEntry[] | null;
  redirect(entries: Array<{ from: string; to: string; status?: number }>): RedirectEntry[] | null;

  /** Attach the default Kaelum error handler */
  useErrorHandler(options?: ErrorHandlerOptions): KaelumApp;

  /** Alias for useErrorHandler */
  errorHandler(options?: ErrorHandlerOptions): KaelumApp;

  /** Set or get the static files directory */
  static(dir?: string): KaelumConfig | null;

  /** Remove static file serving */
  removeStatic(): KaelumConfig;

  /** Register a plugin */
  plugin(fn: KaelumPlugin, options?: Record<string, any>): KaelumApp;

  /** List registered plugin names */
  getPlugins(): string[];

  /** Gracefully close the server and run cleanup hooks */
  close(): Promise<void>;
  close(cb: (err?: Error | null) => void): KaelumApp;

  /** Register a cleanup function to run during graceful shutdown */
  onShutdown(fn: () => void | Promise<void>): KaelumApp;

  /** Add X-Request-Id header to every request */
  requestId(options?: RequestIdOptions): KaelumApp;

  /** Add Server-Timing header with request duration */
  timing(options?: TimingOptions): KaelumApp;

  /** Expose semantic response helpers on res object */
  useResponseHelpers(): KaelumApp;

  /** Create a route group scoped to a URL prefix with optional shared middleware */
  group(prefix: string, ...middleware: RequestHandler[]): KaelumGroup;
}

declare global {
  namespace Express {
    interface Response {
      ok(data?: any): this;
      created(data?: any): this;
      noContent(): this;
      badRequest(error?: any): this;
      unauthorized(error?: any): this;
      forbidden(error?: any): this;
      notFound(error?: any): this;
      conflict(error?: any): this;
      error(error?: any, status?: number): this;
    }
  }
}

/**
 * Create a new Kaelum application instance.
 * Kaelum wraps Express with opinionated defaults and helper methods.
 */
declare function createApp(): KaelumApp;

export = createApp;
