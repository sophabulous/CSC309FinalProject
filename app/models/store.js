"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const storesSchema = new Schema (
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
            type: String,
            required: [true, 'Store address required'],
            unique: true
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
        }
    },
    {collection: "stores"}

);

const storeModel = mongoose.model('Store', storesSchema);

module.exports = storeModel;
