const host = process.env.HOST || "http://localhost:8000"

module.exports = {
    host: host,
    issuerServiceUrl: process.env.ISSUER_URL || "https://issuer.trustedkey.com",
    walletServiceUrl: process.env.WALLET_URL || "https://wallet.trustedkey.com",
    callbackRoute: "/oauth/callback",
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    port: process.env.port || 8000,
    accessTokenUri: 'https://wallet.trustedkey.com/oauth/token',
    authorizationUri: 'https://wallet.trustedkey.com/oauth/authorize',
    redirectUri: 'https://localhost:8000/oauth/callback',
    registerScopes: ['openid', 'profile']
}