const express = require("express");
const mongoose = require("mongoose");
const authRoute = require("./routes/registerRoute");
const content = require("./routes/content");
const cors = require("cors");
const db = require("./config/key").mongoURI;
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

mongoose.connect(
  db,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected")
);

app.use(express.json());
app.use("/api/user", authRoute);
app.use("/api/user", content);

app.listen(port);
