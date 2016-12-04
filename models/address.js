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
                Address.belongsTo(models.Zip)
                //Address.hasMany(models.ZipDistance, {through: 'zip'});
            }
        }
    });
    return Address;
};