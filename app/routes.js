"use strict";

// create a new express router
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller.js'),
    storesController = require('./controllers/stores.controller.js'),
    fruitsController = require('./controllers/fruits.controller.js'),
    usersController = require('./controllers/users.controller.js');


module.exports = router;


// Main index
router.get('/', mainController.displayHome);


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
// Show user profile
router.get('/user/:id', usersController.showUser);
// Create new user
router.post('/signup', usersController.createNewUser);
// Login
router.post('/login', usersController.loginUser);
// Update user email, name, photo
router.post('/user', usersController.updateUserProfile);
// Update user password
router.post('/password', usersController.updateUserPassword);
// Signout user
router.get('/signout', usersController.signoutUser);
