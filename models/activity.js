"use strict";
module.exports = (sequelize, DataTypes) => {
  const activity = sequelize.define(
    "activity",
    {
      type: { type: DataTypes.STRING, allowNull: false },
      recurrence: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {}
  );
  activity.associate = function (models) {
    activity.hasMany(models.event);
  };
  return activity;
};
