'use strict';
module.exports = function (sequelize, DataTypes) {
    var Zip = sequelize.define('Zip', {
        zip: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
                Zip.hasMany(models.Address, {as: 'Addresses'});
            }
        }
    });
    return Zip;
};