"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fruitSchema = new Schema(
    {
        // Type of fruit, want to be able to validate somehow
        type: {
            type: String, required: true
            // enum: [allFruitNames] TODO: figure out the best way to validate
        },
        // Country where the fruit was grown
        origin: {
            type: String
            // enum: [countries] TODO: figure out the best way to validate
        },
        // Non-negative double
        price: {
            type: Number, min: 0, required: true
        },
        // Non-negative integer
        quantity: {
            type: Number, min: 0, required: true
        }
    },
    {
        collection: "fruits"
    }
);

mongoose.connect('mongodb://localhost/fruitdb');
module.exports = mongoose.model('Fruit', fruitSchema);