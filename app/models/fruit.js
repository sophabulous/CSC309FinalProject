'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Enum validation for fruits and seasons.
const fruitEnum = {
    values: [
        'apple',
        'apricot',
        'avocado',
        'banana',
        'bilberry',
        'blackberry',
        'blackcurrant',
        'blueberry',
        'boysenberry',
        'cantaloupe',
        'currant',
        'cherry',
        'cherimoya',
        'cloudberry',
        'coconut',
        'cranberry',
        'cucumber',
        'date',
        'dragonfruit',
        'durian',
        'elderberry',
        'feijoa',
        'fig',
        'goji berry',
        'gooseberry',
        'grape',
        'grapefruit',
        'guava',
        'honeydew',
        'jackfruit',
        'kiwi',
        'kumquat',
        'lemon',
        'lime',
        'lychee',
        'mango',
        'marionberry',
        'nectarine',
        'papaya',
        'passionfruit',
        'peach',
        'pear',
        'persimmon',
        'plantain',
        'plum',
        'pineapple',
        'pomegranate',
        'pomelo',
        'raspberry',
        'satsuma',
        'star fruit',
        'strawberry',
        'tamarillo',
        'tamarind',
        'tomato',
        'ugli fruit',
        'yuzu',
        'blood orange',
        'clementine',
        'mandarine',
        'tangerine',
        'watermelon'
    ],
    message: 'Not a valid fruit type.'
};

const seasonEnum = {
    values: [
        'fall',
        'winter',
        'spring',
        'summer',
    ],
    message: 'Not a valid season.'
};

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
            enum: fruitEnum
        },
        photo: {
            type: String,
            default: 'https://cdn.pixabay.com/photo/2016/05/25/20/17/icon-1415760_960_720.png'
        },
        season: {
            type: String,
            lower: true,
            required: true,
            enum: seasonEnum
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
        },
        unit: {
            type: String,
            lower: true,
            required: true
        },
        comments: [{
            type: Schema.ObjectId,
            ref: 'Comment'
        }]
    },
    {minimize: false},
    {collection: 'fruits'}
);

const fruitModel = mongoose.model('Fruit', fruitsSchema);

module.exports = fruitModel;
