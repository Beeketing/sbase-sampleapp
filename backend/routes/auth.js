const Router = require('koa-router')
const router = new Router()
const Ctrl = require('../controllers/auth')

router.get('/', Ctrl.auth)

module.exports = router.routes()