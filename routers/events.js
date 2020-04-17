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

module.exports = router;
