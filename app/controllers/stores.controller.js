'use strict';

const Store = require('../models/store'),
    Fruit = require('../models/fruit'),
    Rating = require('../models/rating'),
    dbErrors = require('../services/handleDatabaseErrors'),
    authorize = require('../services/authorize');

module.exports = {
    showStores: showStores,
    showSingleStore: showSingleStore,
    createNewStore: createNewStore,
    updateStore: updateStore,
    deleteStore: deleteStore,
    rateStore: rateStore
};


/**
 * Respond to request with a list of all store objects.
 *
 * Example response to /stores/
 * [{
 *   "storeId": "LO123",
 *   "name": "Loblaws",
 *   "address": {
 *          "street": String,
 *          "city": String
 *          "province": String,
 *          "postalcode": String
 *          }
 *   "photo":
 *   "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
 *   "rateCount": 2,
 *   "rateValue": 4,
 *   "comments": []
 * }]
 *
 * @param req
 * @param res
 */
function showStores(req, res) {
    console.log('Show all stores:');

    // Send all stores from database -- exclude _id field
    Store.find({}, function (err, stores) {
        if (err) {
            console.log(err);
            return res.json({'msg': err.message});
        } else {

            return res.json(stores);
        }
    });
}


/**
 * Respond to request with a strigified store object with /:id as the storeId.
 *
 * Example response to /stores/LO123
 * {
 *   "storeId": "LO123",
 *   "name": "Loblaws",
 *   "address": {
 *          "street": String,
 *          "city": String
 *          "province": String,
 *          "postalcode": String
 *          }
 *   "photo":
 *   "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
 *   "rateCount": 2,
 *   "rateValue": 4,
 *   "comments": []
 * }
 *
 * @param req
 * @param res
 */
function showSingleStore(req, res) {
    let storeId = req.params.id.toUpperCase(); // storeID stored as uppercase

    console.log('Show store ' + storeId);

    Store.findOne({storeId: storeId}, {_id: 0})
    .populate({
        path: 'comments',
        populate: {
            path: 'user',
            select: 'photo username'
        }
    })
    .populate('fruits')
    .exec(function (err, store) {
        if (err) {
            console.log(err);
            return res.json({'msg': err.message});
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.json({'msg': 'Store not found'});
        }

        Fruit.find({storeId: storeId}, function (err, fruits) {
            if (err) {
                console.log(err);
                return res.json({'msg': err.message});
            }
            console.log(store.toJSON());
            return res.json(store);
        })

    })
}


/**
 * Create a new store object and update the database.
 *
 * Must be admin.
 *
 * A request should include a body with the following format:
 *
 * {
 *      storeId: String,
 *      name: String,
 *      address: {
 *          street: String,
 *          city: String
 *          province: String,
 *          postalcode: String
 *          }
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
    // Only admin can create a new store
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.json({'msg': 'Not Authorized.'});
    }

    // validation
    req.checkBody('storeId', 'storeId is required').notEmpty();
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('address.street', 'street is required').notEmpty();
    req.checkBody('address.city', 'city is required').notEmpty();
    req.checkBody('address.province', 'province is required').notEmpty();
    req.checkBody('address.postalcode', 'postalcode is required').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        return res.json(errors);
    }

    // Don't allow setting ratings upfront so selectively build store object
    // from request
    let newStore = new Store({
        storeId: req.body.storeId.toUpperCase(),
        name: req.body.name,
        address: {
            street: req.body.street,
            city: req.body.city,
            province: req.body.province,
            postalcode: req.body.postalcode,
        }
    });

    // Allow default photo to be used if photo is not provided
    req.body.photo ? newStore.photo = req.body.photo : null;

    newStore.save(function (err, newStore) {
        if (err) {
            console.log(err);
            return res.
                json({'msg': dbErrors.handleSaveErrors(err)});
        } else {
            console.log(newStore.storeId +
                ' was added to the database.');
            return res.json({'msg': 'Success'});
        }
    });
}


/**
 * Updates an existing store object and updates the database.
 *
 * Must be admin.
 *
 * Fields that can be updated include 'name', 'address', 'photo'.
 *
 * Sends 'Success' upon success or changes status and sends error message.
 *
 * @param req
 * @param res
 */
function updateStore(req, res) {
    // Only admins can update a store
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.json({'msg': 'Not Authorized.'});
    }

    let storeId = req.params.id.toUpperCase();

    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.json({'msg': err.message});
        }

        store.name = req.body.name || store.name;
        store.address.street = req.body.address.street || store.address.street;
        store.address.city = req.body.address.city || store.address.city;
        store.address.province =
            req.body.address.province || store.address.province;
        store.address.postalcode =
            req.body.address.postalcode || store.address.postalcode;
        store.photo = req.body.photo || store.photo;

        store.save(function (err) {
            if (err) {
                console.log(err);
                return res.
                    json({'msg': dbErrors.handleSaveErrors(err)});
            }
            return res.json({'msg': 'Success'});
        })
    });
}


/**
 * Deletes an existing store object and updates the database.
 *
 * Must be admin.
 *
 * Sends 'Success' upon success or changes status and sends error message.
 *
 * @param req
 * @param res
 */
function deleteStore(req, res) {
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.json({'msg': 'Not Authorized.'});
    }

    let storeId = req.params.id.toUpperCase();
    Store.findOneAndRemove({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.json({'msg': err.message});
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.json({'msg': 'Store not found'});
        }

        console.log('Deleted store ', storeId);
        return res.json({'msg': 'Success'});
    });
}


/**
 * Updates the rating value of an existing store.
 *
 * Msut be logged in.
 *
 * Send {
 *      'rating': Number (min:0, max:5)
 *      }
 * in the request.
 *
 * Sends 'Success' upon success or changes status and sends error message.
 *
 * @param req
 * @param res
 */
function rateStore(req, res) {
    let storeId = req.params.id.toUpperCase(),
        username = req.session.username,
        ratingVal = parseInt(req.body.rating);

    // Check that user is logged in.
    if (!authorize.onlyLoggedIn(username)) {
        return res.json({'msg': 'Not Authorized.'});
    }

    if (!ratingVal || ratingVal < 0 || ratingVal > 5) {
        return res.json({'msg': 'Invalid rating value.'});
    }

    // Find store
    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.
                json({'msg': dbErrors.handleSaveErrors(err)});
        }

        // Create and save new rating to database
        addRating(storeId, username, ratingVal, function (err, rating) {
            if (err) {
                console.log(err);
                return res.json({'msg': err.message});
            }

            // Rating was successfully added, so store's rating can be
            // updated
            store.rateCount++;
            store.rateValue += ratingVal;

            // Rely on MongoDB validation to check for unique and required
            // fields and report appropriate errors.
            store.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.
                        json({'msg': dbErrors.handleSaveErrors(err)});
                } else {
                    console.log(store.name + ' was rated.');
                    return res.json({'msg': 'Success'});
                }
            });
        });
    });
}


/**
 * Helper function for creating a new rating and saving it to the database.
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
            });
        });
}
