const Router = require('koa-router')
const router = new Router()
const Ctrl = require('../controllers/orders')

router.get('/', Ctrl.list)
router.get('/register-webhook', Ctrl.registerWebhook)
router.post('/receive-webhook', Ctrl.receiveWebhook)

module.exports = router.routes()