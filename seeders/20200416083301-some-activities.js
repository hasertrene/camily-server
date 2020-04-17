"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "activities",
      [
        {
          type: "Leisure",
          recurrence: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "Sport",
          recurrence: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "Birthday",
          recurrence: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "Family day",
          recurrence: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          type: "Meeting",
          recurrence: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("activities", null, {});
  },
};
