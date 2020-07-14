const { Demande, Medecin, User } = require("../models");
const Joi = require("@hapi/joi");

const DemandeController = {};

const schema = Joi.object({
  symptomes: Joi.string().required(),
  autre_symptomes: Joi.string(),
  traitement: Joi.string(),
  medecin_id: Joi.number().required(),
});

// creating demande

DemandeController.CreateDemande = async (req, res) => {
  const { body } = req;

  /**************** data validation *******************/

  const result = schema.validate(body);

  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /*********************** cheking if the doctors exits ****************************/

  const medecin = await Medecin.findOne({
    where: {
      id: body.medecin_id,
    },
  });

  if (!medecin) return res.status(400).send("this doctor do not exits");

  /*************************** Inserting demande *******************************/
  try {
    const demande = await Demande.create({
      symptomes: body.symptomes,
      autre_symptomes: body.autre_symptomes,
      traitement: body.traitement,
      medecin_id: body.medecin_id,
      user_id: req.user.id,
    });
    res.send(demande);
  } catch (error) {
    console.log(error);
  }
};

/***************************************************************************************************************/
// get all demande

DemandeController.getAllDemandes = async (req, res) => {
  const { user } = req;
  console.log(user);
  try {
    if (user.type === "patient") {
      var demandes = await Demande.findAll({
        where: {
          user_id: user.id,
        },
      });
    } else {
      var demandes = await Demande.findAll({
        where: {
          medecin_id: user.id,
        },
      });
    }
    res.send(demandes);
  } catch (error) {
    console.log(error);
  }
};

module.exports = DemandeController;
