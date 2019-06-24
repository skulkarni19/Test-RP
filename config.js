const Url = require('url')

const host = process.env.host || "http://localhost:8000"

module.exports = {
    host: host,
    issuerServiceUrl: process.env.ISSUER_URL || "https://issuer.trustedkey.com",
    walletServiceUrl: process.env.WALLET_URL || "https://wallet.trustedkey.com",
    callbackRoute: "/oauth/callback",
    clientID: "",
    clientSecret: "",
    port: process.env.port || 8000,
    accessTokenUri: 'https://wallet.trustedkey.com/oauth/token',
    authorizationUri: 'https://wallet.trustedkey.com/oauth/authorize',
    redirectUri: 'https://localhost:8000/oauth/callback',
    registerScopes: ['openid', 'profile']
}