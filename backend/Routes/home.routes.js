const express = require("express");
const Router = express.Router();

const homeController = require("../Controllers/home.controller");
const authMiddleware = require("../Middlewares/auth.middleware.js");
/*
Router.post("/userUpdate", authMiddleware.isAuth, homeController.userUpdate);
Router.get("/getProfil/:user", homeController.getProfil);
Router.get("/getRents/:user", authMiddleware.isAuth, homeController.getRents);
Router.get("/getCars", homeController.getCars);
Router.get("/getCar/:id", homeController.getCar);
Router.post("/rentCar", authMiddleware.isAuth, homeController.rentCar);
Router.post("/toZero", authMiddleware.isAuth, homeController.toZero);
Router.post("/AddMoney", authMiddleware.isAuth, homeController.AddMoney);
Router.post("/stopRent", authMiddleware.isAuth, homeController.stopRent);
*/

Router.get("/getCsapatok", homeController.getCsapatok);
Router.get("/getEgyCsapat/:id", homeController.getEgyCsapat);
Router.get("/getCsapatTagok/:id", homeController.getCsapatTagok);
Router.get("/getMerkozesek/", homeController.getMerkozesek);
Router.get("/getEgyCsapatTagokkal/:id", homeController.getEgyCsapatTagokkal);
Router.get("/getTagok/", homeController.getTagok);
Router.get("/getMerkozesek/", homeController.getMerkozesek);
module.exports = Router;
