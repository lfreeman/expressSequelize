"use strict";

var express = require('express');
var models = require('../models');
var passport = require("passport");
var User = require("../models/user");

var router = express.Router();

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.infos = req.flash("info");
    next();
});

router.get("/", function (req, res, next) {
    models.User.findAll().then(function (users) {
        res.render('index', {users: users})
    });
    //next();

});

router.get("/users/:username", function (req, res, next) {
    models.User.findOne({
        where: {
            username: req.params.username
        }
    }).then(function (user) {
        res.render("profile", {user: user})
    })
});

router.get("/signup", function (req, res) {
    if (req.isAuthenticated())
        res.redirect('/')
    else
        res.render("signup");
});

router.post("/signup", function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    models.User.findOne({
        where: {
            username: username
        }
    }).then(function (user) {
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        } else {
            models.User.create({username: username, password: password}).then(function (user) {
                passport.authenticate('login', {
                    successRedirect: "/",
                    failureRedirect: "/signup",
                    failureFlash: true
                })(req, res, function () {
                })

            });
        }
    })
});

router.get("/login", function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/')
    else
        res.render("login");
});

router.post("/login", passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}));

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;