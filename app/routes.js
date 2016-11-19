"use strict";

// create a new express router
const express = require('express'),
    router = express.Router(),
    mainController = require('./controllers/main.controller.js'),
    storesController = require('./controllers/stores.controller.js'),
    fruitsController = require('./controllers/fruits.controller.js');


module.exports = router;


// Main index
router.get('/index', mainController.displayHome);


// Seed database
router.get('/stores/seed', storesController.seedStores);
router.get('/fruits/seed', fruitsController.seedFruits);


// Store routes
// Get array of store objects
router.get('/stores', storesController.showStores);
// Get a single store object
router.get('/stores/:id', storesController.showSingleStore);
// Create a new store
router.post('/stores/', storesController.createNewStore);
// Update existing store
router.post('/stores/:id', storesController.updateStore);
// Rate a store
router.post('/stores/rate/:id', storesController.rateStore);
// Delete a store
router.delete('/stores/:id', storesController.deleteStore);


// Fruit routes
// Get an array of fruit objects
router.get('/fruits', fruitsController.showFruits);
// Get a single fruit object
router.get('/fruits/:id', fruitsController.showSingleFruit);
// Create a new fruit
router.post('/fruits/', fruitsController.createNewFruit);
// Update existing fruit
router.post('/fruits/:id', fruitsController.updateFruit);
// Delete existing fruit
router.delete('/fruits/:id', fruitsController.deleteFruit);
