function Routes(app) {

  app.addRoute('/', {
    get: (req, res) => res.send("Hello from GET /"),
    post: (req, res) => res.send("Hello from POST /")
  });

  app.addRoute('/about', {
    get: (req, res) => res.send("About page")
  });
  
}

module.exports = Routes;