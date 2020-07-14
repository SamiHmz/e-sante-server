const { Demande, Medecin, User, sequelize } = require("../models");
const Joi = require("@hapi/joi");
const _ = require("lodash");

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
  try {
    if (user.type === "patient") {
      var demandes = await sequelize.query(`select m.nom,m.prenom,d.id,d.symptomes,d.autre_symptomes,d.traitement,d.image,d.is_treated,d."createdAt" from demande d 
      join medecin m 
      on m.id = d.medecin_id
      where d.user_id = ${user.id}`);
    } else {
      var demandes = await sequelize.query(`
      select u.nom,u.prenom,d.id,d.symptomes,d.autre_symptomes,d.traitement,d.image,d.is_treated,d."createdAt" from demande d 
      join utilisateur u 
      on d.user_id = u.id 
      where d.medecin_id = ${user.id} and is_treated = false ;`);
    }
    res.send(demandes[0]);
  } catch (error) {
    console.log(error);
  }
};

/***************************************************************************************************************/
// update demande

DemandeController.updateDemande = async (req, res) => {
  const { body } = req;

  if (req.user.type == "medecin")
    return res.status(401).send("your not authorised to modifiy demande");
  const updateSchema = _.omit(schema, ["medecin_id"]);
  /**************** data validation *******************/

  const result = schema.validate(body);

  if (result.error)
    return res.status(404).send(result.error.details[0].message);
  /******************cheking if demande exits ******************/

  const demande = await Demande.findOne({
    where: {
      id: req.params.id,
      user_id: req.user.id,
    },
  });

  if (!demande) return res.status(404).send("demande not found");

  try {
    demande.symptomes = body.symptomes;
    demande.autre_symptomes = body.autre_symptomes;
    demande.traitement = body.traitement;
    await demande.save();
    res.send(demande);
  } catch (error) {
    console.log(demande);
  }
};

// delete demande

DemandeController.deleteDemande = async (req, res) => {
  const { user } = req;
  if (user.type == "medecin")
    return res.status(402).send("your not allowed to delete demande");

  /****************** check if consultation exits ********************/
  console.log(user);
  var demande = await Demande.findOne({
    where: { id: req.params.id, user_id: user.id },
  });

  if (!demande) return res.status(404).send("demande not founded");

  try {
    await demande.destroy();
    res.send(demande);
  } catch (error) {
    console.log(error);
  }
};

module.exports = DemandeController;
