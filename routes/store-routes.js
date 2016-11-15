"use strict";

var Store;
exports.config = function () {
    var mongoose = require("mongoose");
    Store = mongoose.model("Store");
};

exports.findAll = function (req, res) {
    console.log('findAll');
    Store.find({}, function (err, allStores) {
        if (err) throw err;
        console.log(allStores);
        res.send(allStores);
    })
};

// TODO: Should we find store by name (too general?) or _id (if possible?)
// or make up store numbers? IDEA: Browsing by store requires users to
// select from list of available stores, each one storing an ID
exports.findOne = function (req, res) {
    console.log('findOne: ' + req.params.id);
    Store.findOne({_id:req.params.id}, function (err, store) {
        if (err) throw err;
        console.log(store);
        res.send('{"inventory": ' + store.inventory + '}');
    })
};

exports.addOne = function (req, res) {
    console.log("addOne");
    let newStore = new Store(req.body);
    // TODO: add some validation?
    newStore.save(function (err, newStore) {
        if (err) throw err;

        res.send('Success');
    })
};

exports.updateOne = function (req, res) {
    console.log("updateOne: " + req.params.id);
    let name = req.body.name;
    // TODO: more fields to edit possibly
    Store.findOne({_id:req.params.id}, function (err, store) {
        if (err) throw err;
        console.log(store);
        if (store) {
            store.name = name;
            store.save(function (err, store) {
                if (err) throw err;
                res.send('Success');
            });
        }
    });
};

exports.deleteOne = function (req, res) {
    console.log("deleteOne: " + req.params.id);
    Store.findOne({_id:req.params.id}, function (err, store) {
        if (err) throw err;
        console.log(store);
        if (store) {
            store.remove();
            res.send('Success');
        }
    });
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

