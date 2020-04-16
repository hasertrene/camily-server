'use strict';
module.exports = (sequelize, DataTypes) => {
  const members = sequelize.define('members', {
    firstName: DataTypes.STRING,
    gender: DataTypes.STRING,
    birthday: DataTypes.STRING,
    colour: DataTypes.STRING,
    parent: DataTypes.BOOLEAN
  }, {});
  members.associate = function(models) {
    // associations can be defined here
  };
  return members;
};