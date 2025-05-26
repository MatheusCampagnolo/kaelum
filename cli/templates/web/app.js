const kaelum = require('kaelum');
const app = kaelum();

const routes = require('./routes');
routes(app);

app.start(3000);