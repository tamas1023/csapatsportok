const express = require("express");
const Router = express.Router();

const authController = require("../Controllers/auth.controller.js");
const authMiddleware = require("../Middlewares/auth.middleware.js");
/*
Router.post("/userLogin", authController.userLogin);
Router.post("/userReg", authController.userReg);
Router.post("/carAdd", authController.carAdd);
Router.post("/changeCar/:id", authMiddleware.isAuth, authController.changeCar);
Router.post("/deleteCar/:id", authMiddleware.isAuth, authController.deleteCar);
*/
Router.post("/felhasznaloBelepes", authController.felhasznaloBelepes);
Router.post("/felhasznaloRegisztracio", authController.felhasznaloRegisztracio);
Router.post("/tagCsapatKilepes/:id", authController.tagCsapatKilepes);
Router.post("/UjCsapat", authController.UjCsapat);
Router.post("/csapatModositas/:id", authController.csapatModositas);
Router.post("/csapatTorles/:id", authController.csapatTorles);
Router.get("/getTagokFelvetelhez/", authController.getTagokFelvetelhez);
Router.post(
  "/csapatTagHozzaadas/:tag_id/:csapat_id",
  authController.csapatTagHozzaadas
);
Router.post("/UjTag", authController.UjTag);
Router.post("/tagTorles/:id", authController.tagTorles);
Router.get("/getEgyTag/:id", authController.getEgyTag);
Router.post("/egyTagModositas/:id", authController.egyTagModositas);
Router.get("/getEgyMerkozes/:id", authController.getEgyMerkozes);
Router.post("/egyMerkozesHozzaadas", authController.egyMerkozesHozzaadas);
Router.post("/egyMerkozesModositas/:id", authController.egyMerkozesModositas);
Router.post("/merkozesTorles/:id", authController.merkozesTorles);

Router.get(
  "/getEgyCsapatTagokSzamaAllampolgarsagSzerint/:id",
  authController.getEgyCsapatTagokSzamaAllampolgarsagSzerint
);
module.exports = Router;
