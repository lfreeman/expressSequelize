'use strict';

var express = require('express');
var models = require('../models');
var passport = require('passport');
var router = express.Router();

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    next();
});

router.get('/', function (req, res) {
    models.User.findAll({include: [models.Address]}).then(function (users) {
        res.render('index', {users: users});
    });


});


router.get('/near', function (req, res) {

    if (req.isAuthenticated()) {
        if (!req.user.Address.zip) {
            req.flash('error', 'Add Zip code');
            res.redirect('/edit');
            return;
        }

        models.Zip.findOne({
            where: {
                zip: req.user.Address.zip
            }
        }).then((zip) => {
            return zip.getAddresses();
        }).then((addresses) => {
            var usersPromise = addresses.map((address) => address.getUser());
            Promise.all(usersPromise).then((users) => {
                res.render('index', {users: users});
            });
        });
    } else {
        res.redirect('/');
    }
});

router.get('/users/:username', function (req, res) {
    models.User.findOne({
        where: {
            username: req.params.username
        },
        include: [models.Address]
    }).then(function (user) {
        res.render('profile', {user: user});
    });
});

router.get('/signup', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('signup');
    }
});

router.post('/signup', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    models.User.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        if (user) {
            req.flash('error', 'User already exists');
            return res.redirect('/signup');
        } else {

            models.User.create({username: username, password: password}).then(function (user) {
                return models.Address.create({}).then(function (address) {
                    return user.getAddress().then(function (result) {
                        // result would be false
                        return user.setAddress(address).then(function () {
                            return user.getAddress().then(function (result) {
                                passport.authenticate('login', {
                                    successRedirect: '/',
                                    failureRedirect: '/signup',
                                    failureFlash: true
                                })(req, res, function () {
                                });
                            });
                        });
                    });
                });
            });
        }
    });
});


router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/');
    } else {
        res.render('login');
    }
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/edit', ensureAuthenticated, function (req, res) {
    res.render('edit');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('info', 'You must be logged in to see this page.');
        res.redirect('/login');
    }
}

router.post('/edit', ensureAuthenticated, function (req, res) {

    const userUpdatePromise = models.User.update(
        {first_name: req.body.first_name, last_name: req.body.last_name},
        {where: {id: req.user.id}});
    const userPromise = models.User.findById(req.user.id);
    const addressPromise = userPromise.then((user) => user.getAddress());
    const zipPromise = models.Zip.findOne({
        where: {
            zip: req.body.zip
        }
    }).then((zip) => {
            if (zip) {
                return models.Zip.findOne({
                    where: {
                        zip: req.body.zip
                    }
                });
            } else {
                return models.Zip.create({zip: req.body.zip});
            }
        }
    );

    const addressUpdatePromise = addressPromise.then((address) => address.updateAttributes({
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        zip: req.body.zip
    }));

    const setZipPromise = Promise.all([
        addressPromise,
        zipPromise
    ]).then((values) => {
        const address = values[0];
        const zip = values[1];
        return zip.addAddress(address);
    });

    Promise.all([
        userUpdatePromise,
        addressUpdatePromise,
        setZipPromise
    ]).then(() => {
        req.flash('info', 'Profile updated!');
        res.redirect('/edit');
    });
});


module.exports = router;
