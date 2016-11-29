"use strict";

// create a new express router
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller'),
    seedController = require('./controllers/seed.controller'),
    storesController = require('./controllers/stores.controller'),
    fruitsController = require('./controllers/fruits.controller'),
    usersController = require('./controllers/users.controller'),
    cartsController = require('./controllers/carts.controller'),
    ordersController = require('./controllers/orders.controller'),
    commentsController = require('./controllers/comments.controller');


module.exports = router;


// Main index
router.get('/', mainController.displayHome);

// Seed database
router.get('/seed', seedController.seed);

// Store routes
// Get array of store objects
router.get('/stores', storesController.showStores);
// Get a single store object
router.get('/stores/:id', storesController.showSingleStore);
// Create a new store
router.post('/stores/', storesController.createNewStore);
// Update existing store
router.post('/stores/:id', storesController.updateStore);
// Delete a store
router.delete('/stores/:id', storesController.deleteStore);
// Rate a store
router.post('/rate/:id', storesController.rateStore);


// Fruit routes
// Get an array of fruit objects -- query with ?type= ?season= ?storeId=
router.get('/fruits', fruitsController.showFruits);
// Get a single fruit object
router.get('/fruits/:id', fruitsController.showSingleFruit);
// Create a new fruit
router.post('/fruits/', fruitsController.createNewFruit);
// Update existing fruit
router.post('/fruits/:id', fruitsController.updateFruit);
// Delete existing fruit
router.delete('/fruits/:id', fruitsController.deleteFruit);


// User routes
// Show all users
router.get('/users/', usersController.showUsers);
// Show user profile
router.get('/users/:id', usersController.showUser);
// Create new user
router.post('/signup', usersController.createNewUser);
// Login
router.post('/login', usersController.loginUser);
// Update user email, name, photo
router.post('/users/:id', usersController.updateUserProfile);
// Update user password
router.post('/password/:id', usersController.updateUserPassword);
// Delete user
router.delete('/users/:id', usersController.deleteUser);
// Signout user
router.get('/signout', usersController.signoutUser);


// Cart routes
// Show all carts
router.get('/carts', cartsController.showCarts);
// Show user's cart
router.get('/carts/:id', cartsController.showSingleCart);
// Add to user's cart
router.post('/carts/:id', cartsController.modifyCart);
// Delete a user's cart
router.delete('/carts/:id', cartsController.deleteCart);
// Checkout
router.post('/checkout/:id', cartsController.checkout);


// Order routes
// Show all orders -- query with ?username=
router.get('/orders', ordersController.showOrders);
// Show single order
router.get('/orders/:id', ordersController.showSingleOrder);


// Comment routes
// Show all comments -- query with ?username=, ?storeId=, ?fruitId=
router.get('/comments', commentsController.showComments);
// Add a fruit comment
router.post('/comments/fruits', commentsController.commentOnFruit);
// Add a store comment
router.post('/comments/stores', commentsController.commentOnStore);
// Delete a comment
router.delete('/comments', commentsController.deleteComment);
