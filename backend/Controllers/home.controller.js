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
exports.getEgyCsapatTagokkal = async (req, res) => {
  const id = req.params.id;
  const result = await sequelize.query(
    `
      SELECT cs.*, 
        (
          SELECT GROUP_CONCAT(
            CONCAT(
              '{"tag_id":', t.tag_id, ',',
              '"csapat_id":', t.csapat_id, ',',
              '"tag_nev":"', t.tag_nev, '",',
              '"szuletesi_datum":"', t.szuletesi_datum, '",',
              '"allampolgarsag":"', t.allampolgarsag, '",',
              '"poszt":"', t.poszt, '"}'
            )
            SEPARATOR ','
          ) 
          FROM tagok AS t
          WHERE t.csapat_id = cs.csapat_id
        ) AS tagok
      FROM csapatok AS cs
      WHERE cs.csapat_id = :id
    `,
    {
      replacements: { id: id },
      type: QueryTypes.SELECT,
    }
  );
  if (!result || result.length === 0) {
    return res.send({ success: false, msg: "Rossz lekérdezés" });
  }
  const teamWithMembers = result.map((team) => {
    const teamData = { ...team };
    teamData.tagok = team.tagok ? JSON.parse(`[${team.tagok}]`) : [];
    return teamData;
  })[0];
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: teamWithMembers,
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
