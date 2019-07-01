require('dotenv').config()

const host = process.env.HOST || "http://localhost:8000"

module.exports = {
    sessionSecret: process.env.SESSION,
    host,
    issuerServiceUrl: process.env.ISSUER_URL || "https://issuer.trustedkey.com",
    walletServiceUrl: process.env.WALLET_URL || "https://wallet.trustedkey.com",
    callbackRoute: "/oauth/callback",
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    port: process.env.PORT || 8000,
    registerScopes: ['openid', 'profile'],
    issuanceClaims: {
        name: "John S. Doe",
        given_name: "John",
        family_name: "Doe",
        gender: "Male",
        birthdate: "120101000000Z",
        address: {
            formatted: {
                endpoint: '/address',
                loa: 1.0
            }
        }
    }
}