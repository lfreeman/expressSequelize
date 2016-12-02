'use strict';
module.exports = function (sequelize, DataTypes) {
    var Address = sequelize.define('Address', {
        street: DataTypes.STRING,
        city: DataTypes.STRING,
        country: DataTypes.STRING,
        zip: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Address.belongsTo(models.User);
            }
        }
    });
    return Address;
};