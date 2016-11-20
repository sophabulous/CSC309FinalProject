'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs');

let fruits, seasons;

// TODO: Get enum working or find a new way to validate fruit types and seasons
// fs.readFile('app/models/fruits-data.json', 'utf-8', function (err, data) {
//     if (err) {
//         throw err;
//     }
//     let d = JSON.parse(data);
//     fruits = d.fruits;
//     seasons = d.seasons;
// });

const fruitsSchema = new Schema(
    {
        storeId: {
            type: String,
            ref: 'Store'
        },
        type: {
            type: String,
            lower: true,
            required: true,
            // enum: fruits
        },
        photo: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png'
        },
        season: {
            type: String,
            lower: true,
            required: true,
            // enum: seasons
        },
        price: {
            type: Number,
            min: 0,
            default: 0,
            required: true
        },
        quantity: {
            type: Number,
            min: 0,
            get: v => Math.round(v),
            set: v => Math.round(v),
            default: 0,
            required: true
        }
    },
    {collection: 'fruits'}
);

const fruitModel = mongoose.model('Fruit', fruitsSchema);

module.exports = fruitModel;
