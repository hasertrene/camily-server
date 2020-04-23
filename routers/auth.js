const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Members = require("../models/").member;
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({ where: { email }, include: [Members] });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res.status(200).send({ token, ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});
router.patch("/update", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .send({ message: "Please provide email, password and family name" });
    }

    const user = await User.findByPk(req.user.id, { include: [Members] });

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "Password incorrect",
      });
    }
    await user.update({ email, name });

    delete user.dataValues["password"]; // don't send back the password hash
    return res.status(200).send({ ...user.dataValues });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password and a name");
  }
  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(400).send({ message: "Something went wrong, sorry" });
  }
});

// The /me endpoint can be used to:
// - get the users email & name using only their token
// - checking if a token is (still) valid
router.get("/me", authMiddleware, async (req, res) => {
  // don't send back the password hash
  delete req.user.dataValues["password"];
  res.status(200).send({ ...req.user.dataValues });
});

router.post("/me", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const userId = req.user.id;
    const { firstName, birthday, gender, colour, parent } = req.body;

    if (!firstName || !birthday || !colour) {
      return res.status(400).send({ message: "Some input missing!" });
    }

    const member = await Members.create({
      firstName,
      birthday,
      gender,
      colour,
      parent,
      userId,
    });
    return res.status(201).send(member);
  } catch (e) {
    next(e);
  }
});
router.patch("/me/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const userId = req.user.id;
    const { firstName, birthday, gender, colour, parent } = req.body;

    if (!firstName || !birthday || !colour) {
      return res.status(400).send({ message: "Some input missing!" });
    }

    const member = await Members.findByPk(id);
    await member.update({
      firstName,
      birthday,
      gender,
      colour,
      parent,
      userId,
    });
    return res.status(201).send(member);
  } catch (e) {
    next(e);
  }
});

router.delete("/me/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (req.user.id === null) {
      return res.status(400).send({ message: "Not logged in!" });
    }
    const member = await Members.findByPk(id);
    await member.destroy();
    return res.status(201).send(member);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
