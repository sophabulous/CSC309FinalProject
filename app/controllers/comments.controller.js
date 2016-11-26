'use strict';

const Comment = require('../models/comment'),
    Fruit = require('../models/fruit'),
    Store = require('../models/store'),
    dbErrors = require('../services/handleDatabaseErrors'),
    authorize = require('../services/authorize');

module.exports = {
    showComments: showComments,
    commentOnFruit: commentOnFruit,
    commentOnStore: commentOnStore,
    deleteComment: deleteComment
};


/**
 * Respond to request with a stringified list of all comment objects.
 *
 * Query by username, fruitId, storeId.
 *
 * Example response to /comments/
 * '[{
 *   "_id": "583a1330d11ab20ce3a67443",
 *   "username": "admin",
 *   "message": "this place is great!",
 *   "storeId": "LO123",
 *   "created": "2016-11-26T22:56:33.938Z"
 * },{
 *   "_id": "583a1330d11ab20ce3a67443",
 *   "username": "admin",
 *   "message": "not ripe!",
 *   "fruitId": "583a1330h11ab20ce3a67456",
 *   "created": "2016-11-26T22:58:33.938Z"
 * }]'
 *
 * @param req
 * @param res
 */
function showComments(req, res) {
    let query = {};

    if (req.query.username) {
        query.username = req.query.username;
    }

    if (req.query.fruitId) {
        query.commentId = req.query.fruitId;
    }

    if (req.query.storeId) {
        query.storeId = req.query.storeId;
    }

    Comment.find(query, function (err, comments) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            console.log(comments);
            return res.send(JSON.stringify(comments));
        }
    });
}


/**
 * Create a new comment object and update the database.
 *
 * Must be admin or active user.
 *
 * A request should be a JSON object in the following format
 *
 * {
 *   "fruitId": String,
 *   "username": String,
 *   "message": String
 * }
 *
 *
 * Sends 'Success' upon success or sets status to 409 and sends error message.
 *
 * @param req
 * @param res
 */
function commentOnFruit(req, res) {
    let sessionUser = req.session.username,
        requestUser = req.body.username,
        admin = req.session.admin;

    if (!authorize.onlyActiveUserOrAdmin(requestUser, sessionUser, admin)) {
        return res.status(409).send('Not Authorized.');
    }

    let comment = {
        username: requestUser,
        message: req.body.message,
        fruitId: req.body.fruitId
    };

    let newComment = new Comment(comment);

    // Rely on MongoDB validation to check for unique and required
    // fields and report appropriate errors.
    newComment.save(function (err, newComment) {
        if (err) {
            console.log(err);
            return res.status(409).send(dbErrors.handleSaveErrors(err));
        }

        Fruit.findOneAndUpdate({_id: fruitId}, {$push: {comments: newComment}},
            {safe: true}, function (err, fruit) {
                if (err) {
                    console.log(err);
                    return res.status(409).send(dbErrors.handleSaveErrors(err));
                }

                fruit.comments.push(newComment);
                return res.send('Success');
            })
    });
}


/**
 * Create a new comment object and update the database.
 *
 * Must be admin or active user.
 *
 * A request should be a JSON object in the following format
 *
 * {
 *   "storeId": String,
 *   "username": String,
 *   "message": String
 * }
 *
 *
 * Sends 'Success' upon success or sets status to 409 and sends error message.
 *
 * @param req
 * @param res
 */
function commentOnStore(req, res) {
    let sessionUser = req.session.username,
        requestUser = req.body.username,
        admin = req.session.admin,
        storeId = req.body.storeId;

    if (!authorize.onlyActiveUserOrAdmin(requestUser, sessionUser, admin)) {
        return res.status(409).send('Not Authorized.');
    }

    let comment = {
        username: requestUser,
        message: req.body.message,
        storeId: storeId
    };

    let newComment = new Comment(comment);

    // Rely on MongoDB validation to check for unique and required
    // fields and report appropriate errors.
    newComment.save(function (err, newComment) {
        if (err) {
            console.log(err);
            return res.status(409).send(dbErrors.handleSaveErrors(err));
        }

        Store.findOneAndUpdate({storeId: storeId},
            {$push: {comments: newComment}},
            {safe: true},
            function (err, store) {
                if (err) {
                    console.log(err);
                    return res.status(409).send(dbErrors.handleSaveErrors(err));
                }

                return res.send('Success');
            })
    });
}


/**
 * Deletes an existing comment object and updates the database with /:id as
 * the comment _id.
 *
 * Must be admin.
 *
 * Sends 'Success' upon success or modifies status and sends error message.
 *
 * @param req
 * @param res
 */
function deleteComment(req, res) {
    // Only admins can delete a comment
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    Comment.findByIdAndRemove(req.params.id, function (err, comment) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!comment) {
            console.log('Comment not found');
            return res.status(404).send('Comment not found');
        }

        return res.send('Success');
    });
}
