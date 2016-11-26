"use strict";

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ratingsSchema = new Schema(
    {
        _storeId: {
            type: Schema.ObjectIdId,
            ref: 'Store'
        },
        _userId: {
            type: Schema.ObjectId,
            ref: 'User'
        },
        value: {
            type: Integer,
            min: 0,
            max: 5
        }
    },
    {collection: "ratings"},
);

const usersSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true
        },
        ratings: [ratingsSchema]
    },
    {collection: "users"},
);

const userModel = mongoose.model('User', usersSchema);

module.exports = userModel;
