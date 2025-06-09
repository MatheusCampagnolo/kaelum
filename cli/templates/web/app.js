const kaelum = require("kaelum");
const logger = require("./middlewares/logger");

const app = kaelum();

// Middlewares globais (aplicados a todas as rotas)
app.setMiddleware([logger]);

// SetConfig para aplicar configurações de segurança e middlewares
app.setConfig({
  cors: true,
  helmet: true,
});

// Importa e registra as rotas
const routes = require("./routes");
routes(app);

// Inicia o servidor
app.start(3000);