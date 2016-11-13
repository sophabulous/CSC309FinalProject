"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var storeSchema = new Schema(
    {
        // Name of the store
        name: {
            type: String, required: true
        },
        // Collection of integer ratings that should be averaged
        rating: {
            type: [Number],
            get: v =>  (v.reduce(function(a,b) {return a+b;}) / v.length)
        },
        // List of IDs from fruitSchema
        inventory: [mongoose.Schema.Types.ObjectId]
    },
    {collection: "stores"},
    // Ensure inventory is always available even when empty
    {minimize: false}
);

mongoose.connect('mongodb://localhost/storedb');
module.exports = mongoose.model('Store', storeSchema);
