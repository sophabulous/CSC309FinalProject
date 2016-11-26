"use strict";

const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator'),
    Schema = mongoose.Schema;

const usersSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'Must supply a username.'],
            unique: true
        },
        email: {
            type: String,
            required: [true, 'Must supply an email.'],
            unique: true,
            uniqueCaseInsensitive: true
        },
        name: {
            type: String,
            required: [true, 'Must provide a name.']
        },
        password: {
            type: String,
            required: [true, 'Must provide a password.']
        },
        admin: {
            type: Boolean,
            default: false
        },
        address: {
            type: String,
            required: [true, 'Must supply an address.']
        },
        photo: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2016/03/31/14/47/avatar-1292817__340.png'
        }
    },
    {minimize: false},
    {collection: 'users'}
).plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique.'});

const userModel = mongoose.model('User', usersSchema);

module.exports = userModel;
