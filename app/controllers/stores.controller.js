'use strict';

const Store = require('../models/store');
const Fruit = require('../models/fruit');
const User  = require('../models/user');

module.exports = {
    showStores: showStores,
    showSingleStore: showSingleStore,
    createNewStore: createNewStore,
    updateStore: updateStore,
    deleteStore: deleteStore,
    rateStore: rateStore,
    seedStores: seedStores
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
    Store.find({}, {_id: 0}, function (err, stores) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong');
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
 *      inventory: [Fruits]
 * }'
 *
 * @param req
 * @param res
 */
function showSingleStore(req, res) {
    let storeId = req.params.id.toUpperCase();
    console.log('Show store ' + storeId);
    Store.findOne({storeId: storeId}, {_id: 0}, function (err, store) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.send(404, 'Store not found');
        }

        Fruit.find({storeId: {$eq: storeId}}, function (err, fruits) {
            if (err) {
                console.log(err);
                store.inventory = [];
                return res.send(JSON.stringify(store))
            } else {
                console.log(fruits);
                // TODO: find out why this doesn't work
                store.inventory = fruits;
                console.log(store);
                return res.send(JSON.stringify(store));
            }
        });
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
    // TODO: only allow admin users to add store

    console.log('createNewStore');


    let newStore = new Store(req.body);

    newStore.save(function (err, newStore) {
        if (err) {
            // TODO: Experiment with error messages to give user more details
            // TODO: Test Mongo validation to determine if more is required here
            console.log(err);
            return res.send(400, 'Could not add new store.');
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
    // TODO: only allow admin users to update store
    let storeId = req.params.id.toUpperCase();
    console.log('updateStore: ' + storeId);
    let name = req.body.name,
        address = req.body.address,
        photo = req.body.photo;

    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.send(404, 'Store not found');
        }

        // only update fields supplied in request
        store.name = name || store.name;
        store.address = address || store.address;
        store.photo = photo || store.photo;

        store.save(function (err, store) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something went wrong.');
            } else {
                console.log('Successfully updated store ' + store.storeId);
                return res.send('Success');
            }
        });

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
    // TODO: only allow admin users to delete store
    let storeId = req.params.id.toUpperCase();
    console.log('deleteStore: ' + storeId);
    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.send(404, 'Store not found');
        }

        store.remove(function (err, result) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something went wrong.');
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
 * Send {'rating': Number } (min:0, max:5) in the request.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function rateStore(req, res) {
    // TODO: Only allow logged in users to rate and only if they haven't already
    // rated
    let storeId = req.params.id.toUpperCase();

    if (!req.body.rating) {
        console.log('Rating not specified for store ' + storeId);
        return res.send(400, 'Could not update rating.');
    }

    Store.findOne({storeId: storeId}, function (err, store) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        if (!store) {
            console.log('Store ' + storeId + 'not found.');
            return res.send(404, 'Store not found');
        }

        store.rateCount++;
        store.rateValue += parseInt(req.body.rating);
        store.save(function (err) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something went wrong.');
            } else {
                console.log(store.name + ' was rated.');
                return res.send('Success');
            }
        });
    });
}


/**
 * Seed the database with store objects.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function seedStores(req, res) {
    const stores = [
        {
            storeId: 'LO123',
            name: 'Loblaws',
            address: '123 fake st.',
            photo: 'https://assets.shop.loblaws.ca/ContentMedia/lsl/logos/banner_en.png'
        }, {
            storeId: 'NF123',
            name: 'No Frills',
            address: '123 another st.',
            photo: 'http://www.nofrills.ca/content/dam/lclonline/nofrills/nofrills-logo.jpg'
        }
    ];

    // Clear database before seeding again
    Store.remove({}, function () {
        for (let store of stores) {
            let newStore = new Store(store);
            newStore.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.send(400, 'Could not seed database.');
                }
                console.log(store.storeId + ' was added to the database.');
            });
        }
    });

    return res.send('Success');
}
