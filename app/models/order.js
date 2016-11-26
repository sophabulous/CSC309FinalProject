'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ordersSchema = new Schema(
    {
        username: {
            type: String,
            ref: 'User'
        },
        items: [{
            id: String,
            price: Number,
            storeId: String,
            type: {
                type: String // required because type is keyword
            },
            quantity: Number
        }],
        total: {
            type: Number,
            min: 0,
            default: 0,
        }
    },
    {collection: 'orders'}
);

const orderModel = mongoose.model('Order', ordersSchema);

module.exports = orderModel;
