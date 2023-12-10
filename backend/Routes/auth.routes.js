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
module.exports = Router;
