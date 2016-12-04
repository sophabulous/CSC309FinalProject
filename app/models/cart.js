'use strict';

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const cartsSchema = new Schema(
    {
        username: {
            type: String,
            ref: 'User',
            unique: true
        },
        items: [{
            fruit: {
                type: Schema.ObjectId,
                ref: 'Fruit',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            }
        }],
        total: {
            type: Number,
            min: 0,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
            expires: '1h',
            required: true
        }
    },
    {collection: 'carts'}
);

cartsSchema.plugin(uniqueValidator, {message: 'Only one cart per user.'});

cartsSchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

const cartModel = mongoose.model('Cart', cartsSchema);

module.exports = cartModel;
