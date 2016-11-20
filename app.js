var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require ("mongoose");
var models = require('./models/models');
var stores = require('./routes/store-routes');

// Database startup
models.init();
mongoose.connect("mongodb://localhost/ripdb", function (err, res) {
    if (err) console.log ('ERROR connecting to database. ' + err);
    else console.log ('Connected to database.');
});


// Node startup
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public/assets'));

// Get the index page:
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


// Store routes
stores.config();
app.get('/stores', stores.findAll);
app.get('/stores/:id', stores.findOne);
app.post('/stores/', stores.addOne);
app.post('/stores/:id', stores.updateOne);
app.delete('stores/:id', stores.deleteOne);

app.listen(3000);
console.log('Listening on port 3000');