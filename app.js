require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

// Database startup
mongoose.connect(process.env.DB_URI, function (err) {
    if (err) {
        console.log('ERROR connecting to database. ' + err);
    } else {
        console.log('Connected to database.');
    }
});

// Node startup
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routing
app.use(require('./app/routes'));

app.listen(process.env.PORT || 3000);
console.log('Listening on port ' + process.env.PORT || 3000);