// server.js
// load the things we need
let express = require('express');
let expressLayouts = require("express-ejs-layouts");
const oauth = require("./oauth")
const bodyParser = require("body-parser");

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
    console.log(req.body.email);
    res.render('index.html');
});

app.listen(8000);