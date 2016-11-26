'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;


// Note that comments can be made on stores and fruits
const commentsSchema = new Schema(
    {
        storeId: {
            type: String,
            ref: 'Store'
        },
        fruitId: {
            type: Schema.ObjectId,
            ref: 'Fruit'
        },
        username: {
            type: String,
            ref: 'User',
            required: true
        },
        message: {
            type: String,
            required: true
        },
        created: {
            type: Date,
            default: Date.now(),
            required: true
        }
    },
    {collection: 'comments'}
);

const commentModel = mongoose.model('Comment', commentsSchema);

module.exports = commentModel;
