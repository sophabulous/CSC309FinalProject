'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


const ratingsSchema = new Schema(
    {
        storeId: {
            type: String,
            ref: 'Store',
            required: true
        },
        username: {
            type: String,
            ref: 'User',
            required: true
        },
        value: {
            type: Number,
            min: 0,
            max: 5,
            required: true
        }
    },
    {collection: 'ratings'}
);

const ratingModel = mongoose.model('Rating', ratingsSchema);

module.exports = ratingModel;
