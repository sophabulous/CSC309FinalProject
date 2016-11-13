"use strict";

var Store = require('../models/store');

exports.findAll = function (req, res) {
    console.log('findAll');
    Store.find({}, function (err, allStores) {
        if (err) throw err;
        console.log(allStores);
        res.send(allStores);
    })
};

exports.addOne = function (req, res) {
    console.log("addOne");
    let newStore = new Store(req.body);

    newStore.save(function (err, newStore) {
        if (err) throw err;

        res.send('Success');
    })
};


exports.rate = function (req, res) {
    Store.findOne({"id": req.params.id}, function (err, store) {
        if (err) throw err;
        store.rating.append(req.params.rating);
        store.save(function(err) {
            if (err) throw err;
            console.log(store.name + " was rated!");
            res.send('{"rating": ' + store.rating + '}');
        });
    });
};

