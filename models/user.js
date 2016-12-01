'use strict';
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        gender: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    }, {
        instanceMethods: {}

    }, {
        hooks: {
            // beforeUpdate: function (user, options) {
            //
            // }
        }
    });
    return User;
};