const { Comune } = require("../models");

const ComuneController = {};

ComuneController.getAllComune = async (req, res) => {
  try {
    const listComune = await Comune.findAll({
      attributes: ["id", "nom", "wilaya_id"],
      where: { wilaya_id: req.params.id },
    });
    res.send(listComune);
  } catch (error) {
    console.log(error);
  }
};

module.exports = ComuneController;
