const { User, Medecin, Sequelize } = require("../models");
const sendMessage = require("../usefull/twilo-sms");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const generator = require("generate-password");

// envirment variable
require("dotenv/config");
const jwtKey = process.env.JWT_KEY;

const UserController = {};

const patientSchema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  numero: Joi.string().regex(/^\d+$/).length(10).required().messages({
    "string.pattern.base": `numero : must be a number`,
  }),
  email: Joi.string().email().required(),
  comune_id: Joi.number().required(),
});

const docShema = Joi.object({
  nom: Joi.string().required(),
  prenom: Joi.string().required(),
  numero: Joi.string().regex(/^\d+$/).length(10).required().messages({
    "string.pattern.base": `numero : must be a number`,
  }),
  email: Joi.string().email().required(),
  specialite_id: Joi.number().required(),
});

// creating new user

UserController.createNewUser = async (req, res) => {
  const { body } = req;
  const { type } = req.params;
  // const docShema =

  if (type == "medecin" || type == "patient") {
  } else return res.status(400).send("invalid request");

  /**************** data validation *******************/
  const result =
    type == "patient" ? patientSchema.validate(body) : docShema.validate(body);

  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /****************** cheking if the user already exists *******************/

  if (type == "patient") {
    var user = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: body.email }, { numero: body.numero }],
      },
    });
  } else if (type == "medecin") {
    var user = await Medecin.findOne({
      where: {
        [Sequelize.Op.or]: [{ email: body.email }, { numero: body.numero }],
      },
    });
  }

  if (user) return res.status(400).send("user already exist");

  /*************************** generating the password *************************************/

  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  /***************************** hashing the password ************************/
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  /*********************** inserting the user in db ************/

  try {
    if (type == "patient") {
      user = await User.create({
        nom: body.nom,
        prenom: body.prenom,
        numero: body.numero,
        email: body.email,
        comune_id: body.comune_id,
        pass: hashed,
        pass_text: password,
      });
    } else {
      user = await Medecin.create({
        nom: body.nom,
        prenom: body.prenom,
        numero: body.numero,
        email: body.email,
        pass: hashed,
        pass_text: password,
        specialite_id: body.specialite_id,
      });
    }
    // /************* sending the password to client *************/
    // const number = `+213${parseInt(body.numero)}`;
    // sendMessage(number, password);

    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

/****************************************************************************************************************/

// users authentification

UserController.auth = async (req, res) => {
  const { body } = req;
  const { type } = req.params;

  if (type == "medecin" || type == "patient") {
  } else return res.status(400).send("invalid request");

  /**************** data validation *******************/
  const loginShema = Joi.object({
    numero: Joi.string().regex(/^\d+$/).length(10).required().messages({
      "string.pattern.base": `numero : must be a number`,
    }),
    pass: Joi.string().required(),
  });

  const result = loginShema.validate(body);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /**************** cheking if the user exists  *******************/

  if (type == "patient") {
    var user = await User.findOne({
      where: {
        numero: body.numero,
      },
    });
  } else {
    var user = await Medecin.findOne({
      where: {
        numero: body.numero,
      },
    });
  }

  if (!user) return res.status(400).send("Invalid email or password");

  /****************************check the password **************************/

  const validatePassword = await bcrypt.compare(body.pass, user.pass);
  if (!validatePassword) return res.status(400).send(" email or password");

  /**************************** **************************/

  const token = jwt.sign({ id: user.id, type }, jwtKey);
  res.send(token);
};

module.exports = UserController;
