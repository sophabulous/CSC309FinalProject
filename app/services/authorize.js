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
    console.log("requestedUser:", requestedUser);
    console.log("activeUser:", activeUser);
    console.log("admin:", admin);
    console.log("authorization granted:", admin || (activeUser && (requestedUser === activeUser)));
    return admin || (activeUser && (requestedUser === activeUser));
}

function onlyLoggedIn(user) {
    console.log("user:", user);
    console.log("authorization granted:", user != null);
    return user != null;
}

function onlyNotLoggedIn(user) {
    console.log("user:", user);
    console.log("authorization granted:", user == null);
    return user == null;
}

function onlyNotLoggedInOrAdmin(user, admin) {
    console.log("user:", user);
    console.log("admin:", admin);
    console.log("authorization granted:", !user || admin);
    return !user || admin;
}
