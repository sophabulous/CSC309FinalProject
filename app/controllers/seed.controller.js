'use strict';

const authorize = require('../services/authorize'),
    Store = require('../models/store'),
    Fruit = require('../models/fruit'),
    User = require('../models/user'),
    mongoose = require('mongoose');


module.exports = {
    seed: seed,
    seedStores: seedStores,
    seedFruits: seedFruits,
    seedUsers: seedUsers
};

function seedStores(callback) {
    mongoose.connection.db.dropCollection('stores', function () {
        Store.create(stores.stores, function (err) {
            if (err) {
                console.log(err);
                callback('Failed to seed stores');
            }
        });
    });
    callback('Success');
}

function seedFruits(callback) {
    mongoose.connection.db.dropCollection('fruits', function () {
        Fruit.create(fruits.fruits, function (err) {
            if (err) {
                console.log(err);
                callback('Failed to seed fruits');
            }
        });
    });
    callback('Success');
}

function seedUsers(callback) {
    mongoose.connection.db.dropCollection('users', function () {
        User.create(users.users, function (err) {
            if (err) {
                console.log(err);
                callback('Failed to seed users');
            }
        });
    });
    callback('Success')
}

function seed(req, res) {
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.json({'msg': 'Not Authorized.'});
    }

    seedUsers(function (msg) {
        if (msg !== 'Success') {
            return res.json({'msg': msg});
        }
        seedFruits(function (msg) {
            if (msg !== 'Success') {
                return res.json({'msg': msg});
            }
            seedUsers(function (msg) {
                if (msg !== 'Success') {
                    return res.json({'msg': msg});
                }
                return res.json({'msg': 'Success'});
            });
        });
    });

}

let stores = {
    "stores": [
        {
            "storeId": "LO123",
            "name": "Loblaws",
            "address": {
                "street": "11 Redway Road",
                "city": "East York",
                "province": "ON",
                "postalcode": "M4H 1P6"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
            "rateCount": 2,
            "rateValue": 4,
            "comments": []
        },
        {
            "storeId": "LO124",
            "name": "Loblaws",
            "address": {
                "street": "396 St Clair Ave W",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M5P 3N3"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "LO125",
            "name": "Loblaws",
            "address": {
                "street": "650 Dupont St",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M6G 4B1"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
            "rateCount": 9,
            "rateValue": 30,
            "comments": []
        },
        {
            "storeId": "LO126",
            "name": "Loblaws",
            "address": {
                "street": "60 Carlton St",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M5B 1J2"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "LO127",
            "name": "Loblaws",
            "address": {
                "street": "301 Moore Ave",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M4G 1E1"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "LO128",
            "name": "Loblaws",
            "address": {
                "street": "585 Queen St W",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M5V 2B7"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Loblaws.svg/250px-Loblaws.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "NO213",
            "name": "No Frills",
            "address": {
                "street": "243 Alberta Ave",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M6C 1C6"
            },
            "photo": "http://nofrills.flyerify.com/uploads/companies/thumb/141/nofrills.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "NO214",
            "name": "No Frills",
            "address": {
                "street": "1951 Eglinton Ave W",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M6E 2J7"
            },
            "photo": "http://nofrills.flyerify.com/uploads/companies/thumb/141/nofrills.png",
            "rateCount": 5,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "NO215",
            "name": "No Frills",
            "address": {
                "street": "900 Dufferin St",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M6H 1K8"
            },
            "photo": "http://nofrills.flyerify.com/uploads/companies/thumb/141/nofrills.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "NO216",
            "name": "No Frills",
            "address": {
                "street": "449 Parliament S",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M5A 3A3"
            },
            "photo": "http://nofrills.flyerify.com/uploads/companies/thumb/141/nofrills.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "MO456",
            "name": "Metro",
            "address": {
                "street": "425 Bloor St W",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M5S 1X6"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Metro_Inc._logo.svg/189px-Metro_Inc._logo.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "MO457",
            "name": "Metro",
            "address": {
                "street": "2300 Yonge St",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M4P 1E4"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Metro_Inc._logo.svg/189px-Metro_Inc._logo.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        },
        {
            "storeId": "MO458",
            "name": "Metro",
            "address": {
                "street": "735 College St",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M6G 1C5"
            },
            "photo": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Metro_Inc._logo.svg/189px-Metro_Inc._logo.svg.png",
            "rateCount": 0,
            "rateValue": 0,
            "comments": []
        }
    ]
};

let fruits = {
    "fruits": [
        {
            "storeId": "LO126",
            "type": "grapefruit",
            "photo": "https://cdn.pixabay.com/photo/2016/11/02/16/49/orange-1792233__340.jpg",
            "season": "summer",
            "price": 1.20,
            "unit": "approx 500g",
            "quantity": 80
        },
        {
            "storeId": "LO126",
            "type": "apple",
            "photo": "https://cdn.pixabay.com/photo/2013/11/20/22/59/green-214134__340.jpg",
            "season": "fall",
            "price": 0.99,
            "unit": "approx 125g",
            "quantity": 900
        },
        {
            "storeId": "LO126",
            "type": "avocado",
            "photo": "https://cdn.pixabay.com/photo/2016/01/31/16/30/avocado-1171725__340.jpg",
            "season": "summer",
            "price": 0.80,
            "unit": "approx 100g",
            "quantity": 12
        },
        {
            "storeId": "MO458",
            "type": "banana",
            "photo": "https://cdn.pixabay.com/photo/2016/09/03/20/48/bananas-1642706__340.jpg",
            "season": "summer",
            "price": 0.50,
            "unit": "approx 500g",
            "quantity": 2
        },
        {
            "storeId": "MO458",
            "type": "grapefruit",
            "photo": "https://cdn.pixabay.com/photo/2016/09/05/19/44/grapefruit-1647507__340.jpg",
            "season": "summer",
            "price": 1.00,
            "unit": "approx 500g",
            "quantity": 33
        },
        {
            "storeId": "MO458",
            "type": "avocado",
            "photo": "https://cdn.pixabay.com/photo/2016/10/03/19/30/avocado-1712583__340.jpg",
            "season": "summer",
            "price": 1.20,
            "unit": "approx 100g",
            "quantity": 345
        },
        {
            "storeId": "MO458",
            "type": "apple",
            "photo": "https://cdn.pixabay.com/photo/2016/08/14/11/56/apple-1592588__340.jpg",
            "season": "fall",
            "price": 0.75,
            "unit": "approx 125g",
            "quantity": 23
        },
        {
            "storeId": "NO213",
            "type": "apple",
            "photo": "https://cdn.pixabay.com/photo/2016/08/12/22/38/apple-1589874__340.jpg",
            "season": "fall",
            "price": 0.80,
            "unit": "approx 125g",
            "quantity": 2000
        },
        {
            "storeId": "NO214",
            "type": "banana",
            "photo": "https://cdn.pixabay.com/photo/2011/03/24/10/12/banana-5734__340.jpg",
            "season": "summer",
            "price": 0.55,
            "unit": "approx 180g",
            "quantity": 100
        }
    ]
};

let users = {
    "users": [
        {
            "username": "admin",
            "password": "$2a$10$QHwSOxeg.e6B7HAWWY8lfOxRQ2TKB99SVm4CqObzcSIFMwFTIFkXu",
            "firstname": "admin",
            "lastname": "admin",
            "email": "1@1.com",
            "admin": true,
            "address": {
                "street": "40 St George St",
                "city": "Toronto",
                "province": "ON",
                "postalcode": "M5S 2E4"
            },
        }
    ]
};
