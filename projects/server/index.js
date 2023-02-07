require("dotenv/config");
const express = require("express");
const db = require("./models");
const cors = require("cors");
const fs = require("fs");

const app = express();

const PORT = 2000;

app.use(cors());

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const postsRoutes = require("./routes/postsRoutes");
const commentRoutes = require("./routes/commentRoutes");

app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/comment", commentRoutes);

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    db.sequelize.sync({ alter: true });
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    console.log(`APP RUNNING at ${PORT}`);
  }
});
