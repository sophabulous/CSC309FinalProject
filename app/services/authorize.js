'use strict';

module.exports = {
    onlyAdmin: onlyAdmin,
    onlyActiveUserOrAdmin: onlyActiveUserOrAdmin,
    onlyLoggedIn: onlyLoggedIn,
    onlyNotLoggedIn: onlyNotLoggedIn,
    onlyNotLoggedInOrAdmin: onlyNotLoggedInOrAdmin
};


function onlyAdmin(admin, callback) {
    if (!admin) {
        console.log("Not authorized");
        callback("Not authorized.");
    } else {
        callback(null, true);
    }
}


function onlyActiveUserOrAdmin(requestedUser, activeUser, admin, callback) {
    if (!admin && requestedUser !== activeUser) {
        console.log("Not authorized");
        callback("Not authorized.");
    } else {
        callback(null, true);
    }
}

function onlyLoggedIn(user, callback) {
    if (!user) {
        console.log("Not authorized");
        callback("Not authorized.");
    } else {
        callback(null, true);
    }
}

function onlyNotLoggedIn(user, callback) {
    if (user) {
        console.log("Not authorized");
        callback("Not authorized.");
    } else {
        callback(null, true);
    }
}

function onlyNotLoggedInOrAdmin(user, admin, callback) {
    if (user && !admin) {
        console.log("Not authorized");
        callback("Not authorized.");
    } else {
        callback(null, true);
    }
}
