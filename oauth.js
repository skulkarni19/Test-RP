const OpenIDClient = require('openid-client')
const UUID = require('uuid')
const Config = require("config")
const host = Config.host
const clientID = Config.clientID
const clientSecret = Config.clientSecret

class OpenIDClient{
    constructor(scopes, flow) {
        this._scopes= scopes
        this._flow = flow
    }

    static getCallbackFlow(req) {
        return req.query.split(':')[0]
    }

    async getAuthUri(query, claims) {
        const nonce = UUID.v4()
    }
}

const clients = {
    "login": new OpenIDClient(["openid"], "login"),
    "register": new OpenIDClient(Config.registerScopes, "register")
}