const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Events = require("../models").event;
const Members = require("../models").member;
const Act = require("../models").activity;
const { SALT_ROUNDS } = require("../config/constants");

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
    res.status(200).send(events);
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

    if (!title || !description || !date || !time || !activityId) {
      return res.status(400).send({ message: "Some input missing" });
    }

    const addEvent = await Events.create({
      title,
      description,
      date,
      time,
      userId,
      memberId,
      activityId,
    });
    return res
      .status(201)
      .send({ message: "Event added to the calendar!", addEvent });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const event = await Events.findByPk(id);

    return res.status(200).send({ message: "Event fetched!", event });
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
    if (!title || !description || !date || !time || !activityId) {
      return res.status(400).send({ message: "Some input missing" });
    }
    const event = await Events.findByPk(id);
    await event.update({
      title,
      description,
      date,
      time,
      userId,
      memberId,
      activityId,
    });
    return res.status(400).send({ message: "Event updated!", event });
  } catch (e) {
    next(e);
  }
});

module.exports = router;