const { Issuer } = require('openid-client')
const UUID = require('uuid')
const Url = require('url')
const Config = require('./config')
const clientID = Config.clientID
const clientSecret = Config.clientSecret

const getClient = async() => {
    const issuer = await Issuer.discover(Config.walletServiceUrl)
    const client = new issuer.client({
        client_id: clientID,
        client_secret: clientSecret
    })
}

const client = await getClient