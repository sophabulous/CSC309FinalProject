'use strict';

let fs = require('fs'),
    mongoose = require('mongoose');

module.exports = {
    seed: function () {
        // Seed database if this is the first time running the app
        fs.readFile('./app/seed/seed-db.json', 'utf-8', function (err, data) {
            if (err) {
                throw err;
            }
            let d = JSON.parse(data);

            let db = mongoose.connection,
                collections = [
                    db.collection('fruits'),
                    db.collection('stores'),
                    db.collection('users')
                ],
                seeds = [
                    d.fruits,
                    d.stores,
                    d.users
                ];

            for (let i = 0, len = collections.length; i < len; i++) {
                collections[i].count(function (err, count) {
                    if (!err && count === 0) {
                        collections[i].insertMany(seeds[i], function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Loaded database with : ",
                                    seeds[i]);
                            }
                        });
                    }
                });
            }
        });
    }
};
