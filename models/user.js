'use strict';
var bcrypt = require("bcrypt-nodejs");

var SALT_FACTOR = 10;
var noop = function () {
};

module.exports = function (sequelize, DataTypes) {

    var User = sequelize.define('User', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        gender: DataTypes.STRING,
        info: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                User.hasOne(models.Address)
            }
        },
        instanceMethods: {
            checkPassword: function (guess, done) {
                bcrypt.compare(guess, this.password, function (err, isMatch) {
                    done(err, isMatch);
                });
            },
            getName: function(){
                return this.first_name || this.username;
            }

        },
        hooks: {
            beforeCreate: function (user, options, done) {
                bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
                    if (err) {
                        return done(err);
                    }
                    bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
                        if (err) {
                            return done(err);
                        }
                        user.password = hashedPassword;
                        done();
                    });
                });
            },
            beforeUpdate: function (user, options, done) {
                // bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
                //     if (err) {
                //         return done(err);
                //     }
                //     bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
                //         if (err) {
                //             return done(err);
                //         }
                //         user.password = hashedPassword;
                //         done();
                //     });
                // });
            }
        }
    });
    return User;
};