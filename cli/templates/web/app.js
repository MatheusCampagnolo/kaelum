const kaelum = require('kaelum');
const cors = require('cors');
const helmet = require('helmet');

const app = kaelum();

// Middlewares globais (aplicados a todas as rotas)
app.setMiddleware(cors());
app.setMiddleware(helmet());

// Importa e registra as rotas
const routes = require('./routes');
routes(app);

// Inicia o servidor
app.start(3000);