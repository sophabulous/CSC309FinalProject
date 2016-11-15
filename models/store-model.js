/* the idea to separate models in this way was borrowed from this source:
 http://www.white-skies.com/2013/02/how-to-set-up-mongoose-mongo-schemas.html
 */

"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = Schema.ObjectId;

var storeSchema = new Schema(
    {
        // Name of the store
        name: { type: String, required: true },
        // Collection of integer ratings that should be averaged
        rating: {
            type: [Number],
            get: v =>  (v.reduce(function(a,b) {return a+b;}) / v.length)
        },
        // List of IDs from fruitSchema
        inventory: [{ type: ObjectID, ref: "Fruit" }]
    },
    {collection: "stores"},
    {minimize: false} // Ensure inventory is always available even when empty
);

module.exports = function () { storeSchema };
mongoose.model("Store", storeSchema);
