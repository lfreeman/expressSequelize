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
                if (user.password != password) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                return done(null, user);
            }
        )
    }));


//         , function (err, user) {
//         if (err) {
//             return done(err);
//         }
//         if (!user) {
//             return done(null, false, {message: "No user has that username!"});
//
//         }
//         user.checkPassword(password, function (err, isMatch) {
//             if (err) {
//                 return done(err);
//             }
//             if (isMatch) {
//                 return done(null, user);
//             } else {
//                 return done(null, false,
//                     {message: "Invalid password."});
//             }
//         });
//     });
// }));

// models.User.findOne({
//     where: {
//         username: req.params.username
//     }
// }).then(function (user) {
//     res.render("profile", {user: user})
// })


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