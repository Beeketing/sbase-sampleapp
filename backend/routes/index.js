module.exports = (router) => {
    router.prefix('/v1')
    router.use('/auth', require('./auth'))
    router.use('/orders', require('./orders'))
}