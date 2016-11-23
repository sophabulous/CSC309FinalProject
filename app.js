'use strict';

require('dotenv').config();

const express = require('express'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    session = require('express-session');


// Database startup (get db url from .env variables)
mongoose.connect(process.env.DB_URI || 'mongodb://localhost/db', function (err){
    if (err) {
        console.log('ERROR connecting to database. ' + err);
    } else {
        console.log('Connected to database.');
    }
});


// Seed database if this is the first time running the app
fs.readFile('./seed-db.json', 'utf-8', function (err, data) {
    if (err) {throw err;}
    let d = JSON.parse(data);

    let db = mongoose.connection;
    let fruitsCollection = db.collection('fruits');
    let storesCollection = db.collection('stores');
    let usersCollection = db.collection('users');

    fruitsCollection.count(function (err, count) {
        if (!err && count === 0) {
            fruitsCollection.insertMany(d.fruits, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted fruits into db.');
                }
            });
        }
    });

    storesCollection.count(function (err, count) {
        if (!err && count === 0) {
            storesCollection.insertMany(d.stores, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted stores into db.');
                }
            });
        }
    });

    usersCollection.count(function (err, count) {
        if (!err && count === 0) {
            usersCollection.insertMany(d.users, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Inserted users into db.');
                }
            })
        }
    })
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
