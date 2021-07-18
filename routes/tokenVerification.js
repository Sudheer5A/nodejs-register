const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("authToken");
  if (!token) return res.status(401).send("denied");

  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("invalid");
  }
};
