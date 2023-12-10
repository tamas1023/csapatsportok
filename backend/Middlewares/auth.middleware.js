const sequelize = require("../Models/connection.modell");
const { QueryTypes } = require("sequelize");
exports.isAuth = async (req, res, next) => {
  //itt kell leellenőrizni, hogy pl az felhasználó be van e lépve, van e érvényes tokenje stb
  try {
    //majd nekünk kell ezt beállítani a post kérésnél

    return next();
  } catch (error) {}
};
