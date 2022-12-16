const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const {router} = require('./router');

const app = new Koa();

app.use(helmet());
app.use(cors());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000);