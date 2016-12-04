'use strict';
module.exports = function(sequelize, DataTypes) {
  var ZipDistance = sequelize.define('ZipDistance', {
    zip1: DataTypes.INTEGER,
    zip2: DataTypes.INTEGER,
    distance: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
          //ZipDistance.belongsToMany(models.address, {through: 'zip2'});
      }
    }
  });
  return ZipDistance;
};