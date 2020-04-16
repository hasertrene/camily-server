'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    type: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING
  }, {});
  event.associate = function(models) {
    // associations can be defined here
  };
  return event;
};