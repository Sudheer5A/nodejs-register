const router = require("express").Router();
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidate, loginValidate } = require("../validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) return res.status(400).send("Email exists");

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    await bcrypt.genSalt(10)
  );

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existingUser = await User.findOne({ email: req.body.email });
  if (!existingUser) return res.status(400).send("Email or password is wrong");

  const validPassword = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!validPassword) return res.status(400).send("invalid password");

  const token = jwt.sign({ _id: existingUser._id }, process.env.SECRET_TOKEN);
  res.header("authToken", token).send(token);

  res.send("success");
});

module.exports = router;
