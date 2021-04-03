const models = require('../models')
const axios = require('axios')
const crypto = require('crypto')
const config = require('../config')

// Get shop by domain
const getShopByDomain =  async(domain) => {
    if (!domain) {
        return [false, 'Please provide shop domain with `?shop=`']
    }

    const shop = await models.Shop.findOne({
        where: {
            domain
        }
    })

    if (!shop || !shop.accessToken) {
        return [false, 'Shop not found or access token not found']
    }

    return [true, shop]
}

// Create axios instance
const createAxiosInstance = (domain, accessToken) => {
    return axios.create({
        baseURL: `https://${domain}/admin/`,
        headers: {'X-ShopBase-Access-Token': accessToken}
    });
}

// List orders
const list = async (ctx) => {
    const domain = ctx.query.shop
    const [success, shop] = await getShopByDomain(domain)

    if (!success) {
        ctx.throw(403, {message: shop})
        return
    }

    const axiosInstance = createAxiosInstance(domain, shop.accessToken);
    try {
        const res = await axiosInstance.get('orders.json');
        ctx.ok(res.data)
    } catch (e) {
        ctx.throw(500, 'error while requesting shopbase api')
    }
}

// Register new order webhook
const registerWebhook = async (ctx) => {
    const domain = ctx.query.shop
    const [success, shop] = await getShopByDomain(domain)

    if (!success) {
        ctx.throw(403, {message: shop})
        return
    }

    const axiosInstance = createAxiosInstance(domain, shop.accessToken);
    try {
        // Register new order webhook
        const params = {
            webhook: {
                // List of all topics can be found at
                // https://developers.shopbase.com/build-an-app-tutorial/making-your-first-request/using-webhooks/webhook-events-and-topics
                topic: 'orders/create',
                address: config.webhookBaseUrl + '/v1/orders/receive-webhook',
                format: 'json'
            }
        }
        const res = await axiosInstance.post('webhooks.json', params);
        ctx.ok(res.data)
    } catch (e) {
        console.log(e)
        ctx.throw(500, 'error while requesting shopbase api')
    }

}

// Receive order webhook
const receiveWebhook = async (ctx) => {
    const hmacHeader = ctx.request.headers['x-shopbase-hmac-sha256']
    if (!hmacHeader) {
        ctx.throw(403, 'Hmac code is required')
    }

    // Verify hmac of webhook
    const generated = crypto.createHmac('sha256', config.clientSecret).update(ctx.request.rawBody).digest('base64');
	if (generated !== hmacHeader) {
        // console.log('gen', generated)
        // console.log('hmacHeader', hmacHeader)
        ctx.throw(403, 'Hmac code verification failed')
    }

    ctx.ok({
        message: 'webhook received',
        data: ctx.request.body
    })
}

module.exports = {
    list,
    registerWebhook,
    receiveWebhook
}