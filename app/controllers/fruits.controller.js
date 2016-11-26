'use strict';

const Fruit = require('../models/fruit'),
    dbErrors = require('../services/handleDatabaseErrors'),
    authorize = require('../services/authorize');

module.exports = {
    showFruits: showFruits,
    showSingleFruit: showSingleFruit,
    createNewFruit: createNewFruit,
    updateFruit: updateFruit,
    deleteFruit: deleteFruit
};


/**
 * Respond to request with a stringified list of all fruit objects.
 *
 * Use type, season or storeId query to get back only fruits of a specific value
 *
 * Example response to /fruits/
 * '[
 *  "_id": "5839bb15c2342805668a8863",
 *  "storeId": "LO126",
 *  "type": "grapefruit",
 *  "season": "summer",
 *  "unit": "approx 500g",
 *  "comments": [],
 *  "quantity": 80,
 *  "price": 1.2,
 *  "photo":
 *  "https://cdn.pixabay.com/photo/2016/11/02/16/49/orange-1792233__340.jpg"
 *  ]'
 *
 * @param req
 * @param res
 */
function showFruits(req, res) {
    let type = req.query.type,
        season = req.query.season,
        storeId = req.query.storeId,
        query = {};

    console.log('Show all! Query by type: ' + type || '""'
        + ' season: ' + season || '""'
        + ' store: ' + storeId || '""');

    if (type) {
        type = type.toLowerCase();
        query.type = type;
    }

    if (season) {
        season = season.toLowerCase();
        query.season = season;
    }

    if (storeId) {
        storeId = storeId.toUpperCase();
        query.storeId = storeId;
    }

    Fruit.find(query).populate('comments').exec(function (err, fruits) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            console.log(fruits);
            return res.send(JSON.stringify(fruits));
        }
    });
}


/**
 * Respond to request with a stringified fruit object of fruit with _id /:id.
 *
 * Example response to /fruits/5839bb15c2342805668a8863
 * '{
 *   "_id": "5839bb15c2342805668a8863",
 *   "storeId": "LO126",
 *   "type": "grapefruit",
 *   "season": "summer",
 *   "unit": "approx 500g",
 *   "comments": [],
 *   "quantity": 80,
 *   "price": 1.2,
 *   "photo":
 *   "https://cdn.pixabay.com/photo/2016/11/02/16/49/orange-1792233__340.jpg"
 * }'
 *
 * @param req
 * @param res
 */
function showSingleFruit(req, res) {
    let id = req.params.id;
    console.log('Show fruit ' + id);
    Fruit.findOne({_id: id}).populate('comments').exec(function (err, fruit) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!fruit) {
            console.log('Fruit ' + id + 'not found.');
            return res.send(404, 'Fruit not found');
        }

        console.log(fruit);
        return res.send(JSON.stringify(fruit));

    });
}


/**
 * Create a new fruit object and update the database.
 *
 * Must be admin.
 *
 * A request should be a JSON object in the following format
 *
 * {
 *   "storeId": String,
 *   "type": String,
 *   "season": String,
 *   "unit": String,
 *   "quantity": Number,
 *   "price": Number,
 *   "photo": String (optional)
 * }
 *
 *
 * Sends 'Success' upon success or sets status to 409 and sends error message.
 *
 * @param req
 * @param res
 */
function createNewFruit(req, res) {
    // Only admins can create a fruit
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    let newFruit = new Fruit(req.body);

    // Rely on MongoDB validation to check for unique and required
    // fields and report appropriate errors.
    newFruit.save(function (err, newFruit) {
        if (err) {
            console.log(err);
            return res.status(409).send(dbErrors.handleSaveErrors(err));
        } else {
            console.log(newFruit._id + ' was added to the database.');
            return res.send('Success');
        }
    });
}


/**
 * Updates an existing fruit object and updates the database with /:id as
 * the fruit _id.
 *
 * Must be admin.
 *
 * Fields that can be updated include 'photo', 'price', 'quantity', 'unit'.
 *
 * A request should be a JSON object in the following format.
 *
 * {
 *   "unit": String (optional),
 *   "quantity": Number (optional),
 *   "price": Number (optional),
 *   "photo": String (optional)
 * }
 *
 * Sends 'Success' upon success or modifies status and sends error message.
 *
 * @param req
 * @param res
 */
function updateFruit(req, res) {
    // Only admins can update a fruit
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    let fruitId = req.params.id;

    Fruit.findOne({_id: fruitId}, function (err, fruit) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!fruit) {
            console.log('Fruit not found');
            return res.status(404).send('Fruit not found');
        }

        fruit.photo = req.body.photo || fruit.photo;
        fruit.price = req.body.price || fruit.price;
        fruit.quantity = req.body.quantity || fruit.quantity;
        fruit.unit = req.body.unit || fruit.unit;

        // Rely on MongoDB validation to check for unique and required
        // fields and report appropriate errors.
        fruit.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(400).send(dbErrors.handleSaveErrors(err));
            }
            console.log('Updated fruit ', fruit._id);
            return res.send('Success');
        });
    });
}


/**
 * Deletes an existing fruit object and updates the database with /:id as
 * the fruit _id.
 *
 * Must be admin.
 *
 * Sends 'Success' upon success or modifies status and sends error message.
 *
 * @param req
 * @param res
 */
function deleteFruit(req, res) {
    // Only admins can delete a fruit
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    Fruit.findByIdAndRemove(req.params.id, function (err, fruit) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!fruit) {
            console.log('Fruit not found');
            return res.status(404).send('Fruit not found');
        }

        return res.send('Success');
    });
}
