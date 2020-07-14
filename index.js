const express = require("express");
const app = express();
const logger = require("morgan");
const router = require("./src/routes/v1");
const { sequelize } = require("./src/models");

/*************envirment varilable *******/
require("dotenv/config");

/***************** Constant ***********************/
const PORT = process.env.YOURHEALTH;

// ************* Middlewares************* //

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ************* Routes************* //

app.use("/api/v1/", router);

/******************* Data Base Connexion ********************/

sequelize.sync({ alter: true }).then(
  app.listen(PORT, () => {
    console.log(`app listening at port ${PORT}...`);
  })
);
