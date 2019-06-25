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
        let claims = null
        const url = await clients['register'].getAuthUri(req.query, claims)
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

        console.log("Got user info")

        if (!userInfo) {
            // eslint-disable-next-line no-console
            console.error("No token was received")
            res.status(403).send(invalidReq)
            return
        }

        let tokenMSG = `
            <pre>${JSON.stringify(userInfo, null, 2)}</pre>
            <br />
            <p><a href='/'>Home</a></p>
            `
        return res.send(tokenMSG)
    }
}