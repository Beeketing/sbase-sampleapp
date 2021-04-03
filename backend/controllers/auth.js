const config = require('../config')
const models = require('../models')
const crypto = require('crypto')

async function auth(ctx) {
    // Read params from url
    const action = ctx.query.action
    const domain = ctx.query.shop

    // If approved
    if (action === 'verify') {
        // Get access token and store to database
        const authCode = ctx.query.code

        // Hmac verification begin
        // Build message without hash
        const keys = Object.keys(ctx.query)

        const messages = []
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] !== 'hmac') {
                messages.push(`${keys[i]}=${ctx.query[keys[i]]}`)
            }
        }
        const message = messages.join('&')
        const generated = crypto.createHmac('sha256', config.clientSecret).update(message).digest('hex');
        
        if (generated !== ctx.query.hmac) {
            ctx.throw(403, 'Request is not authentic')
        }
        // Hmac verification end

        const axios = require('axios')

        const res = await axios.post(`https://${domain}/admin/oauth/access_token.json`, {
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code: authCode
        });
        
        // Save shop & access token to db
        // Access token is available at res.data.access_token
        const [shop, created] = await models.Shop.findOrCreate({
            where: {
                domain: domain
            },
            defaults: {
                accessToken: res.data.access_token
            }
        })

        // Update access token if needed
        if (shop.accessToken !== res.data.access_token) {
            shop.accessToken = res.data.access_token

            shop.save()
        }

        // Redirect to dashboard
        ctx.redirect(config.dashboardURL + '?domain=' + domain)
    } else if (!domain) {
        // domain is empty
        ctx.ok({message: 'Please provide shop\'s domain'})
    } else {
        // New install
        // Get config params
        const clientId = config.clientId
        const scopes = config.scopes
        const redirectUri = config.baseURL + '/v1/auth?action=verify'

        const authUrl = `https://${domain}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`

        ctx.redirect(authUrl);
    }
}

module.exports = {
    auth
}