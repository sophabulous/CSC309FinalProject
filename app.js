'use strict';

require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    session = require('express-session'),
    expressValidator = require('express-validator'),
    seed = require('./app/seed/seed');


// Database startup (get db url from .env variables)
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/db',
    function (err) {
        if (err) {
            console.log('ERROR connecting to database. ' + err);
        } else {
            console.log('Connected to database.');
            // Allow command line argument to reseed database wih initial data
            if (process.argv.length > 2 && process.argv[2] === 'reseed') {
                console.log('Dropping database');
                seed.drop();
            }
            console.log('Seeding database');
            setTimeout(seed.seed, 3000);
        }
    });


// Node startup
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(express.static(__dirname + '/public/'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret', // get secret from .env
    // variables
    cookie: {
        maxAge: 3600000 // auto-end session in one hour
    },
    resave: false,
    saveUninitialized: false
}));


// Allow front end to access session variables (ie. session.username)
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});


// Routing
app.use(require('./app/routes'));

// Use .env to store port or default to port 3000
let port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ' + port);
