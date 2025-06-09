const kaelum = require("kaelum");
const app = kaelum();

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