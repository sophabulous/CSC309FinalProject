'use strict';

const Order = require('../models/order'),
    dbErrors = require('../services/handleDatabaseErrors'),
    authorize = require('../services/authorize');

module.exports = {
    showOrders: showOrders,
    showSingleOrder: showSingleOrder
};


/**
 * Respond to request with a stringified list of all order objects.
 *
 * Query by username.
 *
 * Only authorized for admin.
 *
 * Example response to /orders/
 * '[{
 *  "_id": "5839fa4e6837b30812b3a963",
 *  "username": "admin",
 *  "createdAt": "2016-11-26T21:10:38.831Z",
 *  "total": 12,
 *  "items": [
 *    {
 *      "id": "5839f9466837b30812b3a957",
 *      "price": 1.2,
 *      "storeId": "LO126",
 *      "type": "grapefruit",
 *      "quantity": 10,
 *      "_id": "5839fa4e6837b30812b3a964"
 *    }
 *  ]
 * }]'
 *
 * @param req
 * @param res
 */
function showOrders(req, res) {
    let requestUser = req.query.username,
        sessionUser = req.session.username,
        admin = req.session.admin;

    if (!authorize.onlyActiveUserOrAdmin(requestUser, sessionUser, admin)) {
        return res.status(409).send('Not Authorized.');
    }

    let query = {};

    if (requestUser) {
        query.username = requestUser;
    }

    Order.find(query, function (err, orders) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            console.log(orders);
            return res.send(JSON.stringify(orders));
        }
    });
}


/**
 * Respond to request with a stringified order object with order _id as /:id.
 *
 * Example response to /orders/5839fa4e6837b30812b3a963
 * '{
 *  "_id": "5839fa4e6837b30812b3a963",
 *  "username": "admin",
 *  "createdAt": "2016-11-26T21:10:38.831Z",
 *  "total": 12,
 *  "items": [
 *    {
 *      "id": "5839f9466837b30812b3a957",
 *      "price": 1.2,
 *      "storeId": "LO126",
 *      "type": "grapefruit",
 *      "quantity": 10,
 *      "_id": "5839fa4e6837b30812b3a964"
 *    }
 *  ]
 * }'
 *
 * @param req
 * @param res
 */
function showSingleOrder(req, res) {
    let sessionUser = req.session.username,
        admin = req.session.admin,
        id = req.params.id;

    console.log('Show order ' + id);

    Order.findOne({_id: id}, function (err, order) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!order) {
            console.log('Order ' + id + 'not found.');
            return res.send(404, 'Order not found');
        }

        if (!authorize.onlyActiveUserOrAdmin(order.username, sessionUser, admin)) {
            return res.status(409).send('Not Authorized.');
        }

        console.log(order);
        return res.send(JSON.stringify(order));
    });
}
