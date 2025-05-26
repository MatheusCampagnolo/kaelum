const kaelum = require('kaelum');
const app = kaelum();

const cors = require('cors');
const helmet = require('helmet');

app.setMiddleware(cors());
app.setMiddleware(helmet());

const routes = require('./routes');
routes(app);

app.start(3000);