'use strict';

const User = require('../models/user'),
    bcrypt = require('bcrypt');

module.exports = {
    createNewUser: createNewUser,
    loginUser: loginUser,
    updateUser: updateUser,
    signoutUser: signoutUser
};


function createNewUser(req, res) {
    if (req.session.username) {
        // User is already signed in
        return res.send('Already signed in.');
    }

    let username = req.body.username,
        password = req.body.password,
        passwordConfirm = req.body.password_confirm,
        name = req.body.name,
        address = req.body.address,
        hashedPwd, newUser;

    if (password !== passwordConfirm) {
        // Password confirmation failed
        return res.send('Passwords do not match');
    }

    // If user doesn't already exist, add new user
    User.findOne({userName: username}, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        if (user) {
            return res.send('User already exists.');
        }

        hashedPwd = bcrypt.hashSync(password, 10);
        newUser = new User({
            'userName': username,
            'password': hashedPwd,
            'name': name,
            'address': address
        });

        newUser.save(function (err, newUser) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something went wrong.');
            }

            req.session.username = username;
            req.session.admin = false;
            console.log(newUser);
            console.log(req.session);
            return res.send('Success');
        })
    });
}


function loginUser(req, res) {
    let requestUser = req.body.username,
        requestPass = req.body.password;

    User.findOne({ userName: requestUser }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        // Verify user exists and password matches stored password
        if (user && bcrypt.compareSync(requestPass, user.password)) {
            req.session.username = user.userName;
            req.session.admin = user.admin;
            return res.send('Success');
        } else {
            console.log('Invalid signin ' + user);
            return res.send('Invalid username or password.');
        }
    })
}


function updateUser(req, res) {
    let sessionUser = req.session.username,
        requestUser = req.body.username,
        isAdmin = req.session.admin;

    if (sessionUser || sessionUser !== requestUser || !isAdmin) {
        return res.send('Authorization failed.');
    }

    let username = req.body.username,
        password = req.body.password,
        passwordConfirm = req.body.password_confirm,
        name = req.body.name,
        address = req.body.address,
        hashedPwd;

    if (password !== passwordConfirm) {
        // Password confirmation failed
        return res.send('Passwords do not match');
    }

    // If user doesn't already exist, add new user
    User.findOne({userName: requestUser}, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(500, 'Something went wrong.');
        }

        if (!user) {
            return res.send(404, 'User not found.');
        }

        if (password) {hashedPwd = bcrypt.hashSync(password, 10);}

        // Update all fields that were provided
        user.userName = username || user.userName;
        user.password = hashedPwd || user.password;
        user.name = name || user.name;
        user.address = address || user.address;

        user.save(function (err, user) {
            if (err) {
                console.log(err);
                return res.send(500, 'Something went wrong.');
            }

            console.log(user);
            return res.send('Success');
        })
    });
}

function signoutUser (req, res) {
    req.session.destroy();
    return res.send('Success');
}
