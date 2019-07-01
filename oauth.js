const RP = require("request-promise-native")

const OpenIDClient = require("./utils/tkoauth")
const Config = require("./config")
const Uuid = require('uuid')
const OID = require('trustedkey-js/oid')
const Utils = require('trustedkey-js/utils')
const Claims = require('trustedkey-js/claims')
const TokenIssuerService = require("trustedkey-js/services/trustedkeyissuerservice")
const CredentialRegistryService = require('trustedkey-js/services/credentialregistryservice')

const invalidAuth = "Invalid authentication information"
const invalidReq = "Invalid wallet request"

const clients = {
    "login": new OpenIDClient(["openid"], "login"),
    "register": new OpenIDClient(Config.registerScopes, "register")
}

const OidToClaim = new Map(
    Object.entries(Claims)
      .map(k => k.reverse())
      .filter(k => !/_verified$/.test(k))
)

function getDistributedClaimDetails(userInfo, claimName){
    let claimObj = {}
    if (userInfo && userInfo.hasOwnProperty('_claim_names') && userInfo._claim_names.hasOwnProperty(claimName)){
      // eslint-disable-next-line security/detect-object-injection
      const claimDetails = userInfo._claim_sources[userInfo._claim_names[claimName]]
  
      // eslint-disable-next-line security/detect-object-injection
      const claimSerialNo = userInfo._claim_names[claimName]
      claimObj = {...claimDetails, claimSerialNo}
    }
    return claimObj
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

        // console.log(userInfo)

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
                const credentialRegistryService = new CredentialRegistryService(Config.issuerServiceUrl, Config.clientId, Config.clientSecret)
    
                let expiry = new Date()
                expiry.setDate(expiry.getDate() + 365)

                let requestID = Uuid.v4()
    
                await issuerService.issueClaims({
                    'requestid': requestID, 
                    'attributes': Config.issuanceClaims, 
                    'expiry': expiry, 
                    'pubkey': publicKey, 
                    'loa': 2.0
                })
                
                await new Promise((resolve, _) => setTimeout(resolve, 3000))

                let pems = await issuerService.getClaims(requestID, publicKey)
                for (const pem of pems) {
                    const claim = Utils.parsePem(pem)
                    const serialNo = claim.serialNo
                    if (!claim.attributes[2]) continue

                    const claimName = OidToClaim.get(claim.attributes[2].oid)

                    if (claimName == 'gender' || claimName == 'birthdate') {
                        console.log("Revoking claim")
                        await credentialRegistryService.revokeClaim(serialNo)
                    }
                }
            } catch (e) {
                console.log(e)
                const msg = "Failed to issue claims"
                return res.status(500).send(msg)
            }
        }

        try {
            const issuedDCClaim = getDistributedClaimDetails(userInfo, 'address')

            claim = await RP({
                uri: issuedDCClaim.endpoint + `?claimSerialNo=${issuedDCClaim.claimSerialNo}`,
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + issuedDCClaim.access_token
                },
                json: true
            })
    
            console.log(claim)
        } catch (e) {
            console.log(e)
            return res.status(500).send("Failed to get distributed claim")
        }

        return res.render('login', {userInfo})
    }
}