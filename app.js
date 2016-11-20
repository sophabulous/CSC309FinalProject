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
<<<<<<< HEAD
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public/assets'));

// Get the index page:
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

=======
app.use(bodyParser.urlencoded({extended: false}));
>>>>>>> 75bbc03a4c71ba9ac06c7f6c6ab3d54a9b771501

// Routing
app.use(require('./app/routes'));

app.listen(process.env.PORT || 3000);
console.log('Listening on port ' + process.env.PORT || 3000);