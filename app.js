var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stores = require('./routes/store-routes');

// var index = require('./routes/index');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/', index);

app.get('/stores', stores.findAll);

app.listen(3000);
console.log('Listening on port 3000');