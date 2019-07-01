// server.js
// load the things we need
let express = require('express');
let expressLayouts = require("express-ejs-layouts")
let session = require('express-session')
const oauth = require("./oauth")
const Config = require('./config')
const TKClaim = require('./utils/tkclaim')

let app = express()
app.use(expressLayouts)
app.use(session({
    name: 'session',
    secret: Config.sessionSecret,
    maxAge: 60 * 60 * 1000, // 1 hour
    resave: false,
    saveUninitialized: true,
}))


app.engine('html', require('ejs-locals'));
app.set('view engine', 'html');

// index page 
app.get('/', (_, res) => {
    res.render('index.html');
});

app.get('/login/:login_hint?', (req, res) => {
    oauth.login(req, res)
})

app.get('/register/:login_hint?', (req, res) => {
    oauth.register(req, res)
});

app.get(Config.callbackRoute, (req, res) => {
    console.log("Hitting callback")
    oauth.callback(req, res)
})

app.get('/address', (req, res) => {
    const header = req.headers.authorization
    if (!header) {
        res.status(401).send('Unauthorized')
        return
    }

    const token = header.split(/\s+/) || []

    if (token.length !== 2) {
      return res.status(403).send('Forbidden')
    }
    /*
    try {
      // retrieve distributed claim from db
      const claimSerialNo = req.query.claimSerialNo
      const dcClaim = await TKStore.getDistributedClaim(claimSerialNo) || {}
      if (dcClaim.endpoint) {
      // validate id_token
        TKClaim.verify_id_token(token[1], dcClaim)
        return res.json(dcClaim)
      }
      return res.json({})
    } catch(e) {
      // eslint-disable-next-line no-console
      console.error('Claim Details Error: ', e)
      res.status(500).json({err: e.message})
    }*/
    res.send('1')
})

app.listen(Config.port, () => {
    console.log("Server has started")
})