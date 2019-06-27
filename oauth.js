const OpenIDClient = require("./utils/tkoauth")
const Config = require("./config")
const OID = require('trustedkey-js/oid')
const TokenIssuerService = require("trustedkey-js/services/trustedkeyissuerservice")

const invalidAuth = "Invalid authentication information"
const invalidReq = "Invalid wallet request"

const clients = {
    "login": new OpenIDClient(["openid"], "login"),
    "register": new OpenIDClient(Config.registerScopes, "register")
}

module.exports = {
    register: async (req, res) => {
        console.log("Beginning registration")
        console.log(req.query)
        let claims = {userinfo: {'https://auth.trustedkey.com/publicKey':{essential:true}}}
        const url = await clients['register'].getAuthUri(req, claims)
        console.log("Redirecting to <<<<< " + url)
        return res.redirect(url)
    },

    login: async (req, res) => {
        console.log("Begining login")
        let claims = null
        const url = await clients["login"].getAuthUri(req, claims)
        return res.redirect(url)
    },

    callback: async (req, res) => {
        const err = req.query.error
        console.log(req.query.state)
        const flow = req.query.state

        if (err) {
            res.status(403).send(invalidAuth)
            return
        }

        let userInfo = null
        try {
            // eslint-disable-next-line security/detect-object-injection
            userInfo = await clients[flow].getCallbackToken(req)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e)
            res.status(403).send(invalidReq)
            return
        }

        console.log(userInfo)

        if (!userInfo) {
            // eslint-disable-next-line no-console
            console.error("No token was received")
            res.status(403).send(invalidReq)
            return
        }

        if (flow == 'register') {
            try {
                let publicKey = userInfo['https://auth.trustedkey.com/publicKey']

                console.log("Got public key: ", publicKey)
                const issuerService = new TokenIssuerService(Config.issuerServiceUrl, Config.clientId, Config.clientSecret)
    
                let expiry = new Date()
                expiry.setDate(expiry.getDate() + 365)
    
                await issuerService.issueClaims({'attributes': Config.issuanceClaims, 'expiry': expiry, 'pubkey': publicKey})
            } catch (e) {
                const msg = "Failed to issue claims"
                return res.status(500).send(msg)
            }
        }

        return res.render('login', {userInfo})
    }
}