const { Consultation, Demande, sequelize } = require("../models");
const Joi = require("@hapi/joi");
const _ = require("lodash");

const ConsultationController = {};

const schema = Joi.object({
  diagnostic: Joi.string().required(),
  traitemnet: Joi.string().required(),
  demande_id: Joi.number().required(),
});

const updateShema = Joi.object({
  diagnostic: Joi.string().required(),
  traitemnet: Joi.string().required(),
});

// creating consultation

ConsultationController.createConsultation = async (req, res) => {
  const { body } = req;

  /**************** data validation *******************/
  const result = schema.validate(body);
  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /*********************** cheking if the demande exits ****************************/
  const demande = await Demande.findOne({
    where: {
      id: body.demande_id,
      medecin_id: req.user.id,
    },
  });
  if (!demande) return res.status(400).send("this demande do not exits");

  /*************************** Inserting consultation  *******************************/
  const transaction = await sequelize.transaction();
  try {
    const consultation = await Consultation.create({
      diagnostic: body.diagnostic,
      traitemnet: body.traitemnet,
      demande_id: body.demande_id,
    });
    /************************** modifing demande is treated to tue*********************/
    demande.is_treated = true;
    await demande.save();
    /*************************if every thing go well commit transaction *********/
    await transaction.commit();
    res.send(consultation);
  } catch (error) {
    /*************************if something go wrong rollback the  transaction *********/

    await transaction.rollback();
    console.log(error);
  }
};

// get all consultation

ConsultationController.getAllConsultation = async (req, res) => {
  const { user } = req;
  try {
    if (user.type == "patient") {
      var listConsultation = await sequelize.query(`select c.id,c.diagnostic,c.traitemnet,c."createdAt" as date ,m.nom,m.prenom from consultation c
        join demande d
        on c.demande_id = d.id
        join medecin m
        on m.id = d.medecin_id
        where d.user_id = ${user.id} ;`);
    } else {
      var listConsultation = await sequelize.query(`select c.id,c.diagnostic,c.traitemnet,c."createdAt" as date ,u.nom,u.prenom from consultation c
        join demande d
        on c.demande_id = d.id
        join utilisateur u
        on u.id = d.user_id
        where d.medecin_id =  ${user.id};`);
    }
    res.send(listConsultation[0]);
  } catch (error) {
    console.log(error);
  }
};

// update
ConsultationController.updateConsultation = async (req, res) => {
  const { body, user } = req;
  if (user.type == "patient")
    return res.status(401).send("your not authorised to modifiy demande");

  /**************** data validation *******************/

  const result = updateShema.validate(body);

  if (result.error)
    return res.status(404).send(result.error.details[0].message);

  /******************cheking if consultation  exits ******************/

  let consultation = await Consultation.findOne({
    where: {
      id: req.params.id,
    },
    inculde: {
      model: Demande,
      where: { medecin_id: user.id },
    },
  });
  if (!consultation) return res.status(404).send("consultation  not found");

  /*****************************************/
  try {
    consultation = await Consultation.findByPk(req.params.id);
    consultation.diagnostic = body.diagnostic;
    consultation.traitemnet = body.traitemnet;

    await consultation.save();
    res.send(consultation);
  } catch (error) {
    console.log(error);
  }
};

// delete consultation
ConsultationController.deleteConsultation = async (req, res) => {
  const { user } = req;
  /****************** check if consultation exits ********************/

  if (user.type == "patient") {
    var consultation = await Consultation.findOne({
      where: { id: req.params.id },
      inculde: {
        model: Demande,
        where: { user_id: user.id },
      },
    });
  } else {
    var consultation = await Consultation.findOne({
      where: { id: req.params.id },
      inculde: {
        model: Demande,
        where: { medecin_id: user.id },
      },
    });
  }
  if (!consultation) return res.status(404).send("consultation not founded");

  try {
    consultation = await Consultation.findByPk(req.params.id);
    await consultation.destroy();
    res.send(consultation);
  } catch (error) {
    console.log(error);
  }
};

module.exports = ConsultationController;
