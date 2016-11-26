'use strict';

const User = require('../models/user'),
    bcrypt = require('bcryptjs'),
    dbErrors = require('../services/handleDatabaseErrors'),
    authorize = require('../services/authorize');

module.exports = {
    showUsers: showUsers,
    showUser: showUser,
    createNewUser: createNewUser,
    loginUser: loginUser,
    updateUserProfile: updateUserProfile,
    updateUserPassword: updateUserPassword,
    deleteUser: deleteUser,
    signoutUser: signoutUser
};


/** Show profile of all users.
 *
 * Must be admin.
 *
 *  Example response to /user/
 *  '[{
 *      username: 'Alice123',
 *      name: 'Alice',
 *      address: '123 fake street'
 *      email: 'alice@alice.com'
 *      photo:
 *      'https://cdn.pixabay.com/photo/2016/03/31/14/47/avatar-1292817__340.png'
 *  }]'
 */
function showUsers(req, res) {
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    User.find({}, {password: 0}, function (err, users) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        } else {
            return res.send(users);
        }
    })
}

/**
 * Show profile of single user to a signed in user with :id as the username.
 *
 * Must be signed in.
 *
 * Example response to /user/:id
 *
 * '{
 *      username: String,
 *      name: String,
 *      photo: String (url)
 * }'
 *
 * @param req
 * @param res
 * @returns {*}
 */
function showUser(req, res) {
    // Only show profile of user to signed in users
    if (!authorize.onlyLoggedIn(req.session.username)) {
        return res.status(409).send('Not Authorized.');
    }


    User.findOne({username: req.session.username},
        {password: 0, email: 0, address: 0},
        function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).send(err.message);
            }

            if (!user) {
                return res.status(404).send('User not found.');
            }

            else {
                return res.send(user);
            }
        });
}


/**
 * Create a new user object and update the database.
 *
 * Must be either admin or not logged in.
 *
 * A request should include a body with the following format:
 *
 * {
 *      username: String,
 *      password: String,
 *      name: String,
 *      address: String,
 *      email: String
 * }
 *
 * Sends 'Success' upon success or updates status and sends error message.
 * @param req
 * @param res
 */
function createNewUser(req, res) {
    if (!authorize.onlyNotLoggedInOrAdmin(req.session.username,
            req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    console.log(req.body);
    // Hash password before storing in database
    let hashedPwd = bcrypt.hashSync(req.body.password);

    let newUser = new User({
        username: req.body.username,
        password: hashedPwd,
        name: req.body.name,
        address: req.body.address,
        email: req.body.email
    });

    // Rely on MongoDB validation to check for unique and required
    // fields and report appropriate errors.
    newUser.save(function (err, user) {
        if (err) {
            console.log(err);
            return res.status(409).
                send(dbErrors.handleSaveErrors(err));
        } else {
            req.session.username = user.username;
            req.session.admin = false;
            req.session.cart = {};
            console.log('Added new user ', user.username);
            console.log(req.session);
            return res.send('Success');
        }
    });
}


/**
 * Login user and provide user with session cookie.
 *
 * Must not be logged in already.
 *
 * A request should include a body with the following format:
 *
 * {
 *      username: String,
 *      password: String
 * }
 *
 * Sends 'Success' upon success or updates status and sends error message.
 *
 * @param req
 * @param res
 */
function loginUser(req, res) {
    if (!authorize.onlyNotLoggedIn(req.session.username)) {
        return res.status(409).send('Not Authorized.');
    }

    let username = req.body.username,
        password = req.body.password;

    User.findOne({username: username}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        // Verify user exists and password matches stored password
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.username = user.username;
            req.session.admin = user.admin;
            return res.send('Success');
        } else { // user doesn't exist or password match failed
            console.log('Invalid login attempt.');
            return res.status(409).send('Invalid username or password.');
        }
    });
}


/**
 * Modify user's profile with :id as the username.
 *
 * Must be admin or active user.
 *
 * A request should include a body with the following format:
 *
 * {
 *      address: String (optional),
 *      name: String (optional),
 *      email: String(optional),
 *      photo: String (optional)
 * }
 *
 *  Sends 'Success' upon success or updates status and sends error message.
 *
 * @param req
 * @param res
 */
function updateUserProfile(req, res) {
    let sessionUser = req.session.username,
        requestUser = req.params.id,
        admin = req.session.admin;

    // Authorize changes only for actual user or admin user
    if (!authorize.onlyActiveUserOrAdmin(requestUser, sessionUser, admin)) {
        return res.status(409).send('Not Authorized.');
    }

    User.findOne({username: requestUser}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!user) {
            console.log('Could not find user ', requestUser);
            return res.status(404).send('User not found.');
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.address = req.body.address || user.address;
        user.photo = req.body.photo || user.photo;

        // Rely on MongoDB validation to check for unique and required
        // fields and report appropriate errors.
        user.save(function (err, user) {
            if (err) {
                console.log(err);
                return res.status(409).send(dbErrors.handleSaveErrors(err));
            }

            console.log('Updated user ', user.username);
            return res.send('Success');
        });
    });
}


/**
 * Deletes an existing user object and updates the database with :id as the username.
 *
 * Must be admin.
 *
 * Sends 'Success' upon success or updates status and sends error message.
 *
 * @param req
 * @param res
 */
function deleteUser(req, res) {
    if (!authorize.onlyAdmin(req.session.admin)) {
        return res.status(409).send('Not Authorized.');
    }

    let username = req.params.id;
    User.findOneAndRemove({username: username}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!user) {
            console.log('User ' + username + 'not found.');
            return res.status(404).send('User not found');
        }

        console.log('Deleted user ', username);
        return res.send('Success');
    });
}


/**
 * Modify user's password with with :id as the username.
 *
 * Must be admin or active user.
 *
 * A request should include a body with the following format:
 *
 * {
 *      password: String
 * }
 *
 * Sends 'Success' upon success or updates status and sends error message.
 *
 * @param req
 * @param res
 */
function updateUserPassword(req, res) {
    let sessionUser = req.session.username,
        requestUser = req.params.id,
        admin = req.session.admin;

    // Authorize changes only for actual user or admin user
    if (!authorize.onlyActiveUserOrAdmin(requestUser, sessionUser, admin)) {
        return res.status(409).send('Not Authorized.');
    }

    // Find the user to update profile
    User.findOne({username: sessionUser}, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        if (!user) {
            return res.status(404).send('User not found.');
        }

        user.password = bcrypt.hashSync(req.body.password);

        // Save to database, rely on MongoDB validation
        user.save(function (err, user) {
            if (err) {
                console.log(err);
                return res.status(400).send(dbErrors.handleSaveErrors(err));
            }

            console.log('SUpdated password for  user ', user.username);
            return res.send('Success');
        })
    });
}


/**
 * Signout user.
 *
 * Sends 'Success' upon success.
 *
 * @param req
 * @param res
 */
function signoutUser(req, res) {
    req.session.destroy();
    return res.send('Success');
}
