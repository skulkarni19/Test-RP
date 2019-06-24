// server.js
// load the things we need
let express = require('express');
let expressLayouts = require("express-ejs-layouts");
const oauth = require("./oauth")
const bodyParser = require("body-parser");
const Config = require('./config')

let app = express();
app.use(expressLayouts);


app.set('views', 'views');
app.engine('html', require('ejs-locals'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));

// index page 
app.get('/', function(req, res) {
    res.render('index.html');
});

app.post('/login', function(req, res) {
    res.render('index.html');
});

app.post('/register', function(req, res) {
    res.redirect('/register/?login_hint=' + encodeURIComponent(req.body.email))
})

app.get('/register/:login_hint?', function(req, res) {
    console.log(req.query);
    oauth.register(req, res)
});

app.get(Config.callbackRoute, function(req, res) {
    console.log("Hitting callback")
    oauth.callback(req, res)
})


app.listen(8000);