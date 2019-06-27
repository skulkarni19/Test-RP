// server.js
// load the things we need
let express = require('express');
let expressLayouts = require("express-ejs-layouts")
let session = require('express-session')
const oauth = require("./oauth")
const Config = require('./config')

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

app.listen(Config.port, () => {
    console.log("Server has started")
})