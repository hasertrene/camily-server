"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("events", "memberId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "members",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    }),
      await queryInterface.addColumn("events", "activityId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "activities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("events", "memberId");
    await queryInterface.removeColumn("events", "activityId");
  },
};
