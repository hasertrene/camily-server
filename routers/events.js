const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Events = require("../models").event;
const Members = require("../models").member;
const Act = require("../models").activity;
const { SALT_ROUNDS } = require("../config/constants");
const { Op } = require("sequelize");

const router = new Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const events = await Events.findAll({
      where: { userId: req.user.id },
      include: [Members, Act],
      order: [["date", "ASC"]],
    });

    const activities = await Act.findAll();

    res.status(200).send({ events, activities });
  } catch (e) {
    next(e);
  }
});

router.get("/birthdays/:month", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    let month = Number(req.params.month) + 1;
    if (month < 10) {
      month = 0 + String(month);
    }
    const birthdays = await Events.findAll({
      where: {
        userId: req.user.id,
        activityId: "3",
        date: { [Op.substring]: month },
      },
      include: [Members, Act],
      order: [["date", "ASC"]],
    });
    console.log("-" + req.params.month + "-");
    res.status(200).send({ birthdays });
  } catch (e) {
    next(e);
  }
});
router.get("/birthdays", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const birthdays = await Events.findAll({
      where: {
        userId: req.user.id,
        activityId: "3",
      },
      include: [Members, Act],
      order: [["date", "ASC"]],
    });
    console.log("-" + req.params.month + "-");
    res.status(200).send({ birthdays });
  } catch (e) {
    next(e);
  }
});

router.get("/:year", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    if (
      req.params.year < 0 ||
      req.params.year > 2500 ||
      req.params.year === NaN
    ) {
      return res.status(400).send({ message: "Invalid year!" });
    }

    const events = await Events.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.startsWith]: req.params.year,
        },
      },
      include: [Members, Act],
      order: [["date", "ASC"]],
    });

    const activities = await Act.findAll();

    res.status(200).send({ events, activities });
  } catch (e) {
    next(e);
  }
});
router.get("/:year/:month", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    if (
      req.params.year < 0 ||
      req.params.year > 2500 ||
      req.params.year === NaN
    ) {
      return res.status(400).send({ message: "Invalid year!" });
    }
    if (
      req.params.month < 0 ||
      req.params.month > 11 ||
      req.params.month === NaN
    ) {
      return res.status(400).send({ message: "Invalid month!" });
    }
    let month = Number(req.params.month) + 1;
    if (month < 10) {
      month = 0 + String(month);
    }
    console.log(month);
    const events = await Events.findAll({
      where: {
        userId: req.user.id,
        activityId: { [Op.ne]: "3" },
        date: {
          [Op.and]: [
            { [Op.startsWith]: req.params.year },
            { [Op.substring]: month },
          ],
        },
      },
      include: [Members, Act],
      order: [["date", "ASC"]],
    });

    const activities = await Act.findAll();

    res.status(200).send({ events, activities });
  } catch (e) {
    next(e);
  }
});

router.post("/", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const userId = req.user.id;
    const { title, description, date, time, memberId, activityId } = req.body;

    if (!title || !date) {
      return res.status(400).send({ message: "Some input missing" });
    }
    const newEvent = await Events.create({
      title,
      description,
      date,
      time,
      userId,
      memberId,
      activityId,
    });
    const event = await Events.findOne({
      where: {
        date: date,
        title: title,
        memberId: memberId,
        activityId: activityId,
      },
      include: [Members, Act],
    });

    return res
      .status(201)
      .send({ message: "Event added to the calendar!", event });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const userId = req.user.id;
    const { title, description, date, time, memberId, activityId } = req.body;
    if (!title || !date) {
      return res.status(400).send({ message: "Some input missing" });
    }
    const member = await Members.findByPk(memberId);
    const activity = await Act.findByPk(activityId);
    const editEvent = await Events.findByPk(id);
    await editEvent.update({
      title,
      description,
      date,
      time,
      userId,
      memberId,
      activityId,
    });
    const event = await Events.findByPk(id, { include: [Members, Act] });

    return res.status(200).send({
      message: "Event updated!",
      event,
    });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Event not found" });
    }
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const getEvent = await Events.findByPk(id);

    if (!getEvent) {
      return res.status(400).send({ message: "Event not found" });
    }

    const event = await Events.destroy({ where: { id: id } });
    return res.status(201).send({ message: "Event deleted" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
