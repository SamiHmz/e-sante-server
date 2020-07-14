const { Specialite } = require("../models");

const SpecialiteController = {};

SpecialiteController.getAllSpecialite = async (req, res) => {
  try {
    const listSpecialite = await Specialite.findAll();
    res.send(listSpecialite);
  } catch (error) {
    console.log(error);
  }
};

module.exports = SpecialiteController;
