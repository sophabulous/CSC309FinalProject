'use strict';

const Store = require('../models/store'),
    Rating = require('../models/rating'),
    dbErrors = require('../services/handleDatabaseErrors');

module.exports = {
    showStores: showStores,
    showSingleStore: showSingleStore,
    createNewStore: createNewStore,
    updateStore: updateStore,
    deleteStore: deleteStore,
    rateStore: rateStore
};

/**
 * Respond to request with a stringified list of all store objects.
 *
 * '[{
 *      storeId: String,
 *      name: String,
 *      address: String,
 *      photo: String (url),
 *      rateCount: Number,
 *      rateValue: Number
 * }]'
 *
 * @param req
 * @param res
 */
function showStores(req, res) {
    console.log('Show all stores:');

    // Send all stores from database -- exclude _id field
    Store.find({}, {_id: 0}, function (err, stores) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            console.log(stores);
            return res.send(JSON.stringify(stores))
        }
    });
}


/**
 * Respond to request with a strigified store object.
 *
 * '{
 *      storeId: String,
 *      name: String,
 *      address: String,
 *      photo: String (url),
 *      rateCount: Number,
 *      rateValue: Number
 * }'
 *
 * @param req
 * @param res
 */
function showSingleStore(req, res) {
    let storeId = req.params.id.toUpperCase(); // storeID stored as uppercase

    console.log('Show store ' + storeId);

    // Send store in database that matches unique (enforced) storeId
    // exclude _id field
    Store.findOne({storeId: storeId}, {_id: 0}, function (err, store) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.status(404).send('Store not found');
        }

        console.log(store);
        return res.send(JSON.stringify(store));
    });
}


/**
 * Create a new store object and update the database.
 *
 * A request should include a body with the following format:
 *
 * {
 *      storeId: String,
 *      name: String,
 *      address: String,
 *      photo: String (url, optional),
 * }
 *
 *
 * Sends 'Success' upon success or sets status to 400 and sends error message.
 *
 * @param req
 * @param res
 */
function createNewStore(req, res) {
    if (!req.session.admin) {
        console.log("Not authorized to create store");
        return req.status(409).send("Not authorized.");
    }

    let newStore = new Store(req.body);

    newStore.save(function (err, newStore) {
        if (err) {
            console.log(err);
            return res.status(500).send(dbErrors.handleSaveErrors(err));
        } else {
            console.log(newStore.storeId + ' was added to the database.');
            return res.send('Success');
        }
    })
}


/**
 * Updates an existing store object and updates the database.
 *
 * Fields that can be updated include 'name', 'address', 'photo'.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function updateStore(req, res) {
    // Only admins can update a store
    if (!req.session.admin) {
        console.log("Not authorized to create store");
        return req.status(409).send("Not authorized.");
    }

    let storeId = req.params.id.toUpperCase();
    let updateParams = {};

    // Get update fields from request body
    if (req.body.name) {
        updateParams.name = req.body.name;
    }
    if (req.body.address) {
        updateParams.address = req.body.address;
    }
    if (req.body.photo) {
        updateParams.photo = req.body.photo;
    }

    Store.findOneAndUpdate({storeId: storeId},
        updateParams,
        function (err, store) {
            if (err) {
                console.log(err);
                return res.status(500).send(dbErrors.handleSaveErrors(err));
            }

            console.log('Updated store ', store.storeId);
            res.send('Success');
        });
}


/**
 * Deletes an existing store object and updates the database.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function deleteStore(req, res) {
    if (!req.session.admin) {
        console.log("Not authorized to create store");
        return req.status(409).send("Not authorized.");
    }

    let storeId = req.params.id.toUpperCase();
    console.log('deleteStore: ' + storeId);
    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.status(404).send('Store not found');
        }

        store.remove(function (err, result) {
            if (err) {
                console.log(err);
                return res.status(500).send(err.message);
            } else {
                console.log(result);
                return res.send('Success');
            }
        });
    });
}


/**
 * Updates the rating value of an existing store.
 *
 * Send {
 *      'rating': Number (min:0, max:5)
 *      }
 * in the request.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function rateStore(req, res) {
    let storeId = req.params.id.toUpperCase(),
        username = req.session.username,
        ratingVal = parseInt(req.body.rating);

    // Check that user is logged in.
    if (!username) {
        console.log("Not authorized to rate store");
        return res.status(409).send('Not authorized to rate store.');
    }


    // Find store
    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.status(500).send(dbErrors.handleSaveErrors(err));
        }

        // Create and save new rating to database
        addRating(storeId, username, ratingVal, function (err, rating) {
            if (err) {
                console.log(err);
                return res.status(400).send(err);
            }

            // Rating was successfully added, so store's rating can be updated
            store.rateCount++;
            store.rateValue += ratingVal;
            store.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(dbErrors.handleSaveErrors(err));
                } else {
                    console.log(store.name + ' was rated.');
                    return res.send('Success');
                }
            });
        });
    });
}


/**
 * Herlper function for createing a new rating and saving it to the database.
 *
 * @param storeId
 * @param username
 * @param ratingVal
 * @param callback
 */
function addRating(storeId, username, ratingVal, callback) {
    Rating.findOne({storeId: storeId, username: username},
        function (err, rating) {
            if (err) {
                console.log(err);
                callback(dbErrors.handleSaveErrors(err));
                return;
            }

            if (rating) {
                callback('Cannot rate more than once.');
            }

            let newRating = new Rating({
                storeId: storeId,
                username: username,
                value: ratingVal
            });

            newRating.save(function (err, rating) {
                callback(err, rating);
                return;
            });
        });
}
