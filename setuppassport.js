"use strict";

var passport = require('passport');
var models = require("./models");
var Strategy = require('passport-local').Strategy;

passport.use("login", new Strategy(
    function (username, password, done) {
        models.User.findOne({
            where: {
                username: username
            }
        }).then(function (user) {
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'})
                }

                user.checkPassword(password, function (err, isMatch) {
                    if (err) {
                        return done(null, false,
                            {message: "Invalid password."});
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false,
                            {message: "Invalid password."});
                    }
                });
            }
        )
    }));

module.exports = function () {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        models.User.findById(id).then(function (user) {
            done(null, user);
        });
    });
};