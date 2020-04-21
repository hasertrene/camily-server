"use strict";
const User = require("../models").user;
const Member = require("../models").member;
const Event = require("../models").event;
const Activity = require("../models").activity;

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
    const [
      member1,
      member2,
      member3,
      member4,
      member5,
      member6,
    ] = await Promise.all([
      Member.findOne({
        where: { firstName: "Rene" },
      }),
      Member.findOne({
        where: { firstName: "Dennis" },
      }),
      Member.findOne({
        where: { firstName: "Manel" },
      }),
      Member.findOne({
        where: { firstName: "Charlotte" },
      }),
      Member.findOne({
        where: { firstName: "Suki" },
      }),
      Member.findOne({
        where: { firstName: "Emma" },
      }),
    ]);
    const [type1, type2, type3, type4] = await Promise.all([
      Activity.findOne({
        where: { type: "Leisure" },
      }),
      Activity.findOne({
        where: { type: "Sport" },
      }),
      Activity.findOne({
        where: { type: "Birthday" },
      }),
      Activity.findOne({
        where: { type: "Family day" },
      }),
    ]);

    return Event.bulkCreate(
      [
        {
          title: "Watch football",
          description: "Staring at men running after a ball",
          activityId: type1.id,
          userId: user2.id,
          memberId: member6.id,
          date: "2020-04-18",
          time: "18:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Ballet",
          description: "Twirling and skipping",
          activityId: type2.id,
          userId: user2.id,
          memberId: member6.id,
          date: "2020-04-19",
          time: "17:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Charlotte's turns 36",
          description: "Party!",
          activityId: type3.id,
          userId: user2.id,
          memberId: member4.id,
          date: "2020-04-18",
          time: "13:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Apple pie contest",
          description: "Make the best apple pie",
          activityId: type1.id,
          userId: user1.id,
          memberId: member1.id,
          date: "2020-04-22",
          time: "07:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Kung Fu",
          description: "Kicking and screaming",
          activityId: type2.id,
          userId: user1.id,
          memberId: member3.id,
          date: "2020-04-22",
          time: "20:00",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Family day",
          description: "Chillax!",
          activityId: type4.id,
          userId: user1.id,
          memberId: null,
          date: "2020-04-21",
          time: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("events", null, {});
  },
};
