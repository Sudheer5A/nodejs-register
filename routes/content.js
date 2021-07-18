const router = require("express").Router();
const verify = require("./tokenVerification");

router.get("/content", verify, (req, res) => {
  res.status(200).send("posts are here");
});

module.exports = router;
