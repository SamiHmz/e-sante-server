const { Wilaya } = require("../models");

const WilayaController = {};

WilayaController.getAllWilaya = async (req, res) => {
  try {
    const listWilaya = await Wilaya.findAll();
    res.send(listWilaya);
  } catch (error) {
    console.log(error);
  }
};

module.exports = WilayaController;
