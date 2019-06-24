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

    login: function (req, res) {

    },

    callback: async function (req, res) {
        const err = req.query.error
        console.log(req.query.state)
        const flow = OpenIDClient.getCallbackFlow(req)

        // TODO: Finish registration flow
    }

}