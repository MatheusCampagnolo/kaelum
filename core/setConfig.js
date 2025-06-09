const cors = require("cors");
const helmet = require("helmet");

/**
 * Aplica configurações de segurança e middlewares automáticos.
 * @param {Object} app - A instância do Express.
 * @param {Object} options - Opções de configuração.
 * @param {boolean} options.cors - Ativa o CORS se true.
 * @param {boolean} options.helmet - Ativa o Helmet se true.
 */
function setConfig(app, options = {}) {
  if (options.cors) {
    app.use(cors());
    console.log("🛡️  CORS ativado.");
  }

  if (options.helmet) {
    app.use(helmet());
    console.log("🛡️  Helmet ativado.");
  }

  // Futuras configurações:
  // - options.static
  // - options.logs
  // - options.port
}

module.exports = { setConfig };