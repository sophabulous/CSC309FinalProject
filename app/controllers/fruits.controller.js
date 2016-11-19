"use strict";

const Fruit = require('../models/fruit');

module.exports = {
    showFruits: showFruits,
    showSingleFruit: showSingleFruit,
    createNewFruit: createNewFruit,
    updateFruit: updateFruit,
    deleteFruit: deleteFruit,
    seedFruits: seedFruits
};


/**
 * Respond to request with a stringified list of all fruit objects.
 *
 * '[{
 *      _id: ObjectId
 *      storeId: String,
 *      type: String,
 *      photo: String,
 *      season: String (url),
 *      price: Number
 * }]'
 *
 * @param req
 * @param res
 */
function showFruits (req, res) {
    console.log("Show all fruits:");
    Fruit.find({}, {quantity: 0 }, function (err, fruits) {
        if (err) {
            console.log(err);
            res.status(404);
            res.send("Fruits not found.");
        } else {
            console.log(fruits);
            res.send(JSON.stringify(fruits))
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
 *      photo: String,
 *      season: String (url),
 *      price: Number
 * }'
 *
 * @param req
 * @param res
 */
function showSingleFruit (req, res) {
    console.log("Show fruit " + req.params.id);
    let type = req.params.id.toLowerCase();
    Fruit.findOne({"type": type}, { quantity: 0 }, function (err, fruit) {
        if (err) {
            console.log(err);
            res.status(404);
            res.send("Fruit not found.");
        } else {
            console.log(fruit);
            res.send(JSON.stringify(fruit))
        }
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
function createNewFruit (req, res) {
    console.log("createNewFruit");

    let newFruit = new Fruit(req.body);

    newFruit.save(function (err, newFruit) {
        if (err) {
            // TODO: Experiment with error messages to give user more details
            // TODO: Test Mongo validation to determine if more is required here
            console.log(err);
            res.status(400);
            res.send("Could not add new fruit.");
        } else {
            console.log(newFruit._id + " was added to the database.");
            res.send('Success');
        }
    })
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
function updateFruit (req, res) {
    console.log("updatefruit: " + req.params.id);
    let photo = req.body.photo,
        price = req.body.price,
        quantity = req.body.quantity;

    Fruit.findOne({"_id": req.params.id}, function (err, fruit) {
        if (err) {
            console.log(err);
            res.status(404);
            res.send("Fruit not found.");
        } else if (fruit) {
            // only update fields supplied in request
            fruit.photo = photo || fruit.photo;
            fruit.price = price || fruit.price;
            fruit.quantity = quantity || fruit.quantity;

            fruit.save(function (err, fruit) {
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send("Could not update fruit.");
                } else {
                    console.log("Successfully updated fruit " + fruit._id);
                    res.send("Success");
                }
            });
        } else {
            console.log("Something went wrong.");
            res.status(500);
            res.send("Something went wrong.");
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
function deleteFruit (req, res) {
    console.log("deleteFruit: " + req.params.id);
    Fruit.findOne({"_id": req.params.id}, function (err, fruit) {
        if (err) {
            console.log(err);
            res.status(404);
            res.send("Fruit not found.");
        } else if (fruit) {
            fruit.remove(function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send("Could not delete fruit.")
                } else {
                    console.log(result);
                    res.send('Success');
                }
            });
        } else {
            console.log("Something went wrong.");
            res.status(500);
            res.send("Something went wrong.");
        }
    });
}


/**
 * Seed the database with fruit objects.
 *
 * Sends 'Success' upon success or sends error message.
 *
 * @param req
 * @param res
 */
function seedFruits (req, res) {
    const fruits = [
        {
            storeId: "LO123",
            type: "apple",
            season: "fall",
            price: 1.00,
            quantity: 100
        }, {
            storeId: "NF123",
            type: "banana",
            season: "summer",
            photo: "https://cdn.pixabay.com/photo/2016/09/03/20/48/bananas-1642706_960_720.jpg",
            price: 0.50,
            quantity: 32
        }
    ];

    // Clear database before seeding again
    Fruit.remove({}, function () {
        for (let fruit of fruits) {
            let newFruit = new Fruit(fruit);
            newFruit.save(function (err) {
                if (err) {
                    console.log(err);
                    res.status(404);
                    res.send("Could not seed database. " +
                        "Error on fruit id " + fruit._id);
                }
                console.log(fruit._id + " was added to the database.");
            });
        }
    });

    res.send("Success");
}
