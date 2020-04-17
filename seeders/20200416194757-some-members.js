"use strict";
const User = require("../models").user;
const Member = require("../models").member;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [user1, user2] = await Promise.all([
      User.findOne({
        where: { email: "test@test.com" },
      }),
      User.findOne({
        where: { email: "dummy@dummy.com" },
      }),
    ]);

    return Member.bulkCreate(
      [
        {
          firstName: "Rene",
          gender: "Male",
          birthday: "09/06/1987",
          colour: "blue",
          parent: true,
          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Manel",
          gender: "Female",
          birthday: "29/09/1989",
          colour: "green",
          parent: true,
          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Suki",
          gender: "Female",
          birthday: "21/09/2018",
          colour: "pink",
          parent: false,
          userId: user1.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Dennis",
          gender: "Male",
          birthday: "15/05/1982",
          colour: "blue",
          parent: true,
          userId: user2.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Charlotte",
          gender: "Female",
          birthday: "24/10/1982",
          colour: "red",
          parent: true,
          userId: user2.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: "Emma",
          gender: "Female",
          birthday: "1/2/2013",
          colour: "purple",
          parent: false,
          userId: user2.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("members", null, {});
  },
};
