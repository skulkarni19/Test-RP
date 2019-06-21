const Url = require('url')

const host = process.env.host || "http://localhost:8000"

module.exports = {
    host: host,
    callbackRoute: "/oauth/callback",
    clientID: "",
    clientSecret: "",
    port: process.env.port || 8000,
    registerScopes: ['openid', 'profile']
}