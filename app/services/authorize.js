'use strict';

module.exports = {
    onlyAdmin: onlyAdmin,
    onlyActiveUserOrAdmin: onlyActiveUserOrAdmin,
    onlyLoggedIn: onlyLoggedIn,
    onlyNotLoggedIn: onlyNotLoggedIn,
    onlyNotLoggedInOrAdmin: onlyNotLoggedInOrAdmin
};


function onlyAdmin(admin) {
    return admin;
}


function onlyActiveUserOrAdmin(requestedUser, activeUser, admin) {
    return admin || (activeUser && (requestedUser === activeUser));
}

function onlyLoggedIn(user) {
    return user != null;
}

function onlyNotLoggedIn(user) {
    return user == null;
}

function onlyNotLoggedInOrAdmin(user, admin) {
    return !user || admin;
}
