const OpenIDClient = require("./utils/tkoauth")
const Config = require("./config")

const invalidAuth = "Invalid authentication information"
const invalidReq = "Invalid wallet request"

const clients = {
    "login": new OpenIDClient(["openid"], "login"),
    "register": new OpenIDClient(Config.registerScopes, "register")
}

module.exports = {
    register: async function (req, res) {
        console.log("Beginning registration")
        console.log(req.query)
        let claims = null
        const url = await clients['register'].getAuthUri(req, claims)
        console.log("Redirecting to <<<<< " + url)
        return res.redirect(url)
    },

    login: async function (req, res) {
        console.log("Begining login")
        let claims = null
        const url = await clients["login"].getAuthUri(req.query, claims)
        return res.redirect(url)
    },

    callback: async function (req, res) {
        const err = req.query.error
        console.log(req.query.state)
        const flow = OpenIDClient.getCallbackFlow(req)

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

        return res.render('login', {userInfo})
    }
}