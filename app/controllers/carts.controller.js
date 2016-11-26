'use strict';

const Cart = require('../models/cart'),
    Order = require('../models/order'),
    Fruit = require('../models/fruit'),
    dbErrors = require('../services/handleDatabaseErrors'),
    authorize = require('../services/authorize');

module.exports = {
    showCarts: showCarts,
    showSingleCart: showSingleCart,
    modifyCart: modifyCart,
    deleteCart: deleteCart,
    checkout: checkout
};


/**
 * Respond to request with a stringified list of all cart objects.
 *
 * Only authorized for admin.
 *
 * Responds with
 * [{
 *      _id: ObjectId,
 *      username: String,
 *      total: Number,
 *      items: [Fruits],
 * }]
 *
 * @param req
 * @param res
 */
function showCarts(req, res) {
    // Only admins can see all carts
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    // Must populate fruit to get details about the fruit in the response.
    Cart.find({}).populate('items.fruit').exec(function (err, carts) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            console.log(carts);
            return res.send(JSON.stringify(carts));
        }
    });
}


/**
 * Respond to request with a stringified cart object.
 *
 * Only authorized for admin or active user.
 *
 * Responds with
 * {
 *      _id: ObjectId,
 *      username: String,
 *      total: Number,
 *      items: [Fruits],
 * }
 *
 * @param req
 * @param res
 */
function showSingleCart(req, res) {
    let requestUser = req.params.id,
        activeUser = req.session.username,
        admin = req.session.admin;

    if (!authorize.onlyActiveUserOrAdmin(requestUser, activeUser, admin)) {
        return res.status(409).send('Not authorized.');
    }

    console.log('Show cart for ' + requestUser);

    // Must populate fruit to get details about the fruit in the response.
    // upsert is used to create a new cart if one does not already exist.
    Cart.findOneAndUpdate({username: requestUser},
        {username: requestUser},
        {upsert: true, new: true}).
        populate('items.fruit').
        exec(function (err, cart) {
            if (err) {
                console.log(err);
                return res.status(500).send(err.message);
            }

            if (!cart) {
                console.log('Cart for user ' + requestUser + ' not found.');
                return res.status(404).send('Cart not found');
            }

            req.session.cart = cart.populate('items.fruit');
            console.log(req.session.cart);
            return res.send(JSON.stringify(cart));
        });
}


/**
 * Add or delete items to and from the cart. Creates a new cart if user does
 * not yet have a cart.
 *
 * Cart is stored in session
 *
 * @param req
 * @param res
 */
function modifyCart(req, res) {
    let requestUser = req.params.id,
        activeUser = req.session.username,
        admin = req.session.admin,
        fruitId = req.body.fruitId,
        quantity = parseInt(req.body.quantity, 10);

    if (quantity === NaN) {
        return res.status(409).send('Please provide a numeric quantity.');
    }

    if (!authorize.onlyActiveUserOrAdmin(requestUser, activeUser, admin)) {
        return res.status(409).send('Not authorized.');
    }

    Fruit.findOne({_id: fruitId}, function (err, fruit) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!fruit) {
            return res.status(400).send('Fruit not found');
        }

        // Must populate fruit
        Cart.findOne({username: requestUser}).
            populate('items.fruit').
            exec(function (err, cart) {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err.message);
                }

                // Create new cart if this is the first item accessing the cart
                if (!cart) {
                    if (quantity < 1) {
                        return res.status(409).send('Cart is already empty.');
                    }
                    cart = new Cart({
                        username: requestUser,
                        items: []
                    });
                }

                let item;
                let amountChanged;

                // If item is already in cart, just adjust quantity
                for (let i = 0, len = cart.items.length; i < len; i++) {
                    if (cart.items[i].fruit._id == fruitId) {
                        item = cart.items[i];
                        if (quantity > 0) {
                            // Increase quantity of item already in cart
                            amountChanged = Math.min(quantity, fruit.quantity);
                            item.quantity += amountChanged;
                        } else if (cart.items[i].quantity >
                            Math.abs(quantity)) {
                            // Decrease quantity of item already in cart
                            amountChanged = quantity;
                            item.quantity += amountChanged;
                        } else {
                            // Remove item from cart
                            amountChanged = -(item.quantity);
                            cart.items.splice(i, 1);
                        }
                        break; // Don't need to keep searching for item
                    }
                }

                // Item not in cart already in the cart
                if (!item) {
                    if (quantity > 0) {
                        item = {fruit: fruit, quantity: quantity};
                        cart.items.push(item);
                        amountChanged = quantity;
                    } else {
                        return res.status(409).send('Nothing to remove');
                    }
                }

                cart.total += fruit.price * amountChanged;

                cart.save(function (err, cart) {
                    if (err) {
                        console.log(err);
                        return res.status(409).
                            send(dbErrors.handleSaveErrors(err));
                    }

                    // Make cart available to session
                    req.session.cart = cart;
                    console.log(req.session.cart);
                    return res.send('Success');
                });
            });
    });
}


/**
 * Deletes cart.
 *
 * Send 'Success' on success, 'Partial Success' if only some items could
 * be fulfilled and error message on failure.
 *
 * @param req
 * @param res
 * @returns {*}
 */
function deleteCart(req, res) {
    let requestUser = req.params.id,
        activeUser = req.session.username,
        admin = req.session.admin;

    if (!authorize.onlyActiveUserOrAdmin(requestUser, activeUser, admin)) {
        return res.status(409).send('Not authorized.');
    }

    // Don't need to populate fruit here
    Cart.findOneAndRemove({username: requestUser}, function (err, cart) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!cart) {
            console.log('Cart not found.');
            return res.status(404).send('Cart not found');
        }

        console.log('Deleted cart for ', requestUser);
        req.session.cart = {};
        return res.send('Success');
    });
}


function checkout(req, res) {
    let requestUser = req.params.id,
        activeUser = req.session.username,
        admin = req.session.admin;

    if (!authorize.onlyActiveUserOrAdmin(requestUser, activeUser, admin)) {
        return res.status(409).send('Not authorized.');
    }

    // Must populate fruit
    Cart.findOne({username: requestUser}).
        populate('items.fruit').
        exec(function (err, cart) {
            if (err) {
                console.log(err);
                return res.status(500).send(err.message);
            }

            if (!cart) {
                console.log('Cart not found.');
                return res.status(404).send('Cart not found.');
            }

            if (cart.items.length === 0) {
                console.log('No items in cart.');
                return res.status(409).send('No items in cart.')
            }

            let newOrderObj = {
                username: requestUser,
                items: [],
                total: 0
            };

            // Remove inventory items so they can't be oversold
            // Note: items have not been reserved so some items in cart may
            // not be available. In this case send 'Partial Success'
            // TODO: Come up with a way to reserve items AND return to stock
            // after a certain amount of time has passed.
            let allAvailable = true;
            for (let i = 0, len = cart.items.length; i < len; i++) {
                let item = cart.items[i];
                let quantityChanged;
                if (item.fruit.quantity >= item.quantity) {
                    // there are enough fruit to fulfill the order
                    quantityChanged = item.quantity;
                    item.fruit.quantity -= quantityChanged;
                } else {
                    // not enough fruit to fulfill full order
                    allAvailable = false;
                    quantityChanged = item.fruit.quantity;
                    item.fruit.quantity -= quantityChanged;
                }

                // Save updated fruit quantity in database
                item.fruit.save();

                newOrderObj.total += item.fruit.price * quantityChanged;
                newOrderObj.items.push({
                    id: item.fruit._id,
                    price: item.fruit.price,
                    storeId: item.fruit.storeId,
                    type: item.fruit.type,
                    quantity: quantityChanged
                });
            }

            // Create new order and if successful, delete cart.
            let newOrder = new Order(newOrderObj);
            console.log(newOrder);
            newOrder.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Could not complete order');
                }

                cart.remove();
                req.session.cart = {};

                if (allAvailable) {
                    console.log('Successfully created new order');
                    return res.send('Success');
                } else {
                    console.log('Successfully created partial order');
                    return res.send('Partial Success');
                }
            });
        });
}
