"use strict";
module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define(
    "member",
    {
      firstName: { type: DataTypes.STRING, allowNull: false },
      gender: { type: DataTypes.STRING, allowNull: false },
      birthday: { type: DataTypes.STRING, allowNull: false },
      colour: { type: DataTypes.STRING, allowNull: false },
      parent: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {}
  );
  member.associate = function (models) {
    member.belongsTo(models.user);
    member.hasMany(models.event);
  };
  return member;
};
