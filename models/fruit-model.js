/* the idea to separate models in this way was borrowed from this source:
 http://www.white-skies.com/2013/02/how-to-set-up-mongoose-mongo-schemas.html
 */

"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fruitSchema = new Schema(
    {
        // Type of fruit, want to be able to validate somehow
        type: {
            type: String, required: true
            // enum: [allFruitNames] TODO: figure out the best way to validate
        },
        // Country where the fruit was grown
        origin: {
            type: String
            // enum: [countries] TODO: figure out the best way to validate
        },
        season: {
            // TODO: Figure out how to implement season
            // ideas: bit array or months, 1 of 4 seasons,
        },
        // Non-negative double
        price: {
            type: Number, min: 0, required: true
        },
        // Non-negative integer
        quantity: {
            type: Number, min: 0, required: true
        }
    },
    {
        collection: "fruits"
    }
);

module.exports = function () { fruitSchema };
mongoose.model('Fruit', fruitSchema);
