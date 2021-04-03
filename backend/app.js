const Koa = require('koa')
const Router = require('koa-router')
const logger = require('koa-logger')
const respond = require('koa-respond')
const cors = require('@koa/cors');
const Config = require('./config/config')
var bodyParser = require('koa-bodyparser');

const app = new Koa()
app.use(cors({
    origin: Config.dashboardURL
}));

const router = new Router()
const apiRouter = new Router()

app.use(bodyParser());
app.use(logger())
app.use(respond())

// API routes
require('./routes')(apiRouter)

// Route for homepage
router.get('/', ctx => {
    ctx.ok({message: 'Welcome to sample shopbase app! Visit developers.shopbase.com for more info.'})
})

router.use(apiRouter.routes())
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000)
