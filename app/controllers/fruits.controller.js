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
 * '[{
 *      _id: ObjectId
 *      storeId: String,
 *      type: String,
 *      photo: String (url),
 *      season: String,
 *      price: Number,
 *      quantity: Number
 * }]'
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

    Fruit.find(query, function (err, fruits) {
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
 * Respond to request with a stringified fruit object.
 *
 * '{
 *      _id: ObjectId
 *      storeId: String,
 *      type: String,
 *      photo: String (url),
 *      season: String,
 *      price: Number,
 *      quantity: Number
 * }'
 *
 * @param req
 * @param res
 */
function showSingleFruit(req, res) {
    let id = req.params.id;
    console.log('Show fruit ' + id);
    Fruit.findOne({_id: id}, function (err, fruit) {
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
 * A request should include a body with the following format:
 *
 * {
 *      storeId: String,
 *      type: String,
 *      photo: String (url, optional),
 *      season: String,
 *      price: Number,
 *      quantity: Number
 * }
 *
 *
 * Sends 'Success' upon success or sets status to 400 and sends error message.
 *
 * @param req
 * @param res
 */
function createNewFruit(req, res) {
    // Only admins can create a fruit
    authorize.onlyAdmin(req.session.admin, function (err, success) {
        if (err) {
            return res.status(409).send(err);
        } else {
            let newFruit = new Fruit(req.body);

            newFruit.save(function (err, newFruit) {
                if (err) {
                    console.log(err);
                    res.status(409).send(dbErrors.handleSaveErrors(err));
                } else {
                    console.log(newFruit._id + ' was added to the database.');
                    res.send('Success');
                }
            })
        }
    });
}


/**
 * Updates an existing fruit object and updates the database.
 *
 * Fields that can be updated include 'photo', 'price', 'quantity'.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function updateFruit(req, res) {
    // Only admins can update a fruit
    authorize.onlyAdmin(req.session.admin, function (err, success) {
        if (err) {
            return res.status(409).send(err);
        } else {
            let fruitId = req.params.id;
            let updateParams = {};

            // Get update fields from request body
            if (req.body.photo) {
                updateParams.photo = req.body.photo;
            }
            if (req.body.price) {
                updateParams.price = req.body.price;
            }
            if (req.body.quantity) {
                updateParams.quantity = req.body.quantity;
            }

            Fruit.findOneAndUpdate({_id: fruitId},
                updateParams,
                function (err, fruit) {
                    if (err) {
                        console.log(err);
                        return res.status(500).
                            send(dbErrors.handleSaveErrors(err));
                    }

                    if (!fruit) {
                        console.log('Fruit not found');
                        return res.status(404).send('Fruit not found');
                    }

                    console.log('Updated fruit ', fruit._id);
                    return res.send('Success');
                });
        }
    });
}


/**
 * Deletes an existing fruit object and updates the database.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function deleteFruit(req, res) {
    // Only admins can delete a fruit
    authorize.onlyAdmin(req.session.admin, function (err, success) {
        if (err) {
            return res.status(409).send(err);
        } else {
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
    });
}
