const sequelize = require("../Models/connection.modell");
const { where } = require("sequelize");
const { QueryTypes } = require("sequelize");
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

exports.getCsapatok = async (req, res) => {
  const result = await sequelize.query(`SELECT * FROM csapatok`, {
    type: QueryTypes.SELECT,
  });
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
  });
};
exports.getEgyCsapat = async (req, res) => {
  const id = req.params.id;
  const result = await sequelize.query(
    `SELECT * FROM csapatok WHERE csapat_id= :id`,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (result == 0) {
    return res.send({ success: false, msg: "Rossz lekérdezés" });
  }
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
  });
};
exports.getCsapatTagok = async (req, res) => {
  const id = req.params.id;
  const result = await sequelize.query(
    `SELECT * FROM tagok WHERE csapat_id = :id`,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!result) {
    return res.send({ success: false, msg: "Rossz lekérdezés" });
  }
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
  });
};
exports.getMerkozesek = async (req, res) => {
  const result = await sequelize.query(`SELECT * FROM merkozesek`, {
    type: QueryTypes.SELECT,
    transaction: t,
  });
  if (!result) {
    return res.send({ success: false, msg: "Rossz lekérdezés" });
  }
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
  });
};
