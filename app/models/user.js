"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ratingsSchema = new Schema(
    {
        _storeId: {
            type: Schema.ObjectId,
            ref: 'Store'
        },
        _userId: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        value: {
            type: Number,
            min: 0,
            max: 5
        }
    },
    {collection: 'ratings'}
);

const usersSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        admin: {
            type: Boolean,
            default: false
        },
        address: {
            type: String,
            required: true
        },
        ratings: [ratingsSchema]
    },
    {collection: 'users'}
);

const userModel = mongoose.model('User', usersSchema);

module.exports = userModel;
