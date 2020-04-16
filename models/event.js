"use strict";
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define(
    "event",
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: false },
      date: { type: DataTypes.STRING, allowNull: false },
      time: { type: DataTypes.STRING, allowNull: true },
    },
    {}
  );
  event.associate = function (models) {
    event.belongsTo(models.user);
    event.belongsTo(models.member);
  };
  return event;
};
