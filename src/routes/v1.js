const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

/**********************controllers ************************/
const UserController = require("../contollers/user.controller");
const WilayaController = require("../contollers/wilaya.controller");
const ComuneController = require("../contollers/comune.controller");
const SpecialiteController = require("../contollers/specialite.controller");
const DemandeController = require("../contollers/demande.controller");

/*********************** User routes ************************/
//(type : "patient" or "medecin")
router.post("/user/register/:type", UserController.createNewUser);
router.post("/user/login/:type", UserController.auth);

/************************Authentification ************************/
router.use(auth);

/************************Demandes ************************/
router.post("/demande", DemandeController.CreateDemande);
router.get("/demande", DemandeController.getAllDemandes);

/*********************** Wilaya routes ************************/
router.get("/wilaya", WilayaController.getAllWilaya);

/*********************** comune routes ************************/
router.get("/comune/:id", ComuneController.getAllComune);

/*********************** comune routes ************************/
router.get("/specialite", SpecialiteController.getAllSpecialite);

module.exports = router;
