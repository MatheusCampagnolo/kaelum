// app.js (template Kaelum.js)
// IMPORT será ajustado quando core estiver pronto
import { start, addRoute, setMiddleware } from "kaelum";

//
// Aqui você configura seu app Kaelum:
//

// Exemplo de rota
addRoute("/", {
  get: (req, res) => {
    res.sendFile("./views/index.html");
  },
});

// Habilita middlewares (exemplo futuro)
// setMiddleware(/* ... */);

// Inicia o servidor na porta 3000 por padrão
start(3000);