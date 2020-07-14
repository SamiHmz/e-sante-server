var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
const db = {};
require("dotenv/config");

const DB_NAME = process.env.DB_NAME;

// ************* db config ************* //

const sequelize = new Sequelize(DB_NAME, "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

/***************** test the connexion *********************/

const auth = async (sequelize) => {
  try {
    console.log();
    await sequelize.authenticate();
    console.log("Connection has been established successfully :", DB_NAME);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
auth(sequelize);

// ************* export the models ************* //

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
