require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session');

// Database startup (get db url from .env variables)
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/db',function (err) {
    if (err) {
        console.log('ERROR connecting to database. ' + err);
    } else {
        console.log('Connected to database.');
    }
});

// Node startup
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public/'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret', // get secret from .env
    // variables
    cookie: {
        maxAge: 3600000 // auto-end session in one hour
    },
    // Don't save sessions
    resave: false,
    saveUninitialized: false
}));


// Allow front end to access session variables (ie. session.username)
app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});


// Routing
app.use(require('./app/routes'));

// Use .env to store port or default to port 3000
let port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
