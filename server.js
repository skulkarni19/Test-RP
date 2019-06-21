// server.js
// load the things we need
var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// index page 
app.get('/', function(req, res) {
    res.render('index');
});

app.post('/login', function(req, res) {

});

app.post('/register', function(req, res) {

});

app.listen(8000);