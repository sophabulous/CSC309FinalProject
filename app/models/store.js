'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const storesSchema = new Schema(
    {
        storeId: {
            type: String,
            required: [true, 'Store ID required'],
            upper: true,
            unique: true
        },
        name: {
            type: String,
            required: [true, 'Store name required']
        },
        address: {
            street: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            province: {
                type: String,
                required: true
            },
            postalcode: {
                type: String,
                required: true
            },
        },
        photo: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png'
        },
        rateCount: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            default: 0
        },
        rateValue: {
            type: Number,
            get: v => Math.round(v),
            set: v => Math.round(v),
            default: 0
        },
    },
    {
        collection: 'stores',
        toJSON: {virtuals: true}
    }
).plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique.'});


storesSchema.virtual('comments', {
    ref: 'Comment',
    localField: 'storeId',
    foreignField: 'storeId'
});

storesSchema.virtual('fruits', {
    ref: 'Fruit',
    localField: 'storeId',
    foreignField: 'storeId'
});

const storeModel = mongoose.model('Store', storesSchema);

module.exports = storeModel;
