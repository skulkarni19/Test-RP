// server.js
// load the things we need
let express = require('express');
let expressLayouts = require("express-ejs-layouts")
let session = require('express-session')
const oauth = require("./oauth")
const bodyParser = require("body-parser")
const dotenv = require('dotenv').config()
const Config = require('./config')

let app = express()
app.use(expressLayouts)
app.use(session({
    name: 'session',
    secret: process.env.SESSION,
    maxAge: 60 * 60 * 1000, // 1 hour
    resave: false,
    saveUninitialized: true,
}))


app.set('views', 'views');
app.engine('html', require('ejs-locals'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));

// index page 
app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/login/:login_hint?', function(req, res) {
    oauth.login(req, res)
})

app.get('/register/:login_hint?', function(req, res) {
    oauth.register(req, res)
});

app.get(Config.callbackRoute, function(req, res) {
    console.log("Hitting callback")
    oauth.callback(req, res)
})

app.listen(Config.port);