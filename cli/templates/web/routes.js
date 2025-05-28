const logger = require("./middlewares/logger");

function Routes(app) {
  app.addRoute("/", {
    get: (req, res) => {
      res.sendFile("views/index.html", { root: __dirname });
    },
    post: (req, res) => res.send("POST: Dados recebidos na página inicial."),
  });

  app.addRoute("/about", {
    get: (req, res) => res.send("About page"),
  });

  // Rota "/secure" com middleware aplicado diretamente
  app.addRoute("/secure", {
    get: [
      logger,
      (req, res) => {
        res.send("GET: Área segura! Middleware foi executado.");
      },
    ],
  });
  
}

module.exports = Routes;
