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
  const result2 = await sequelize.query(
    `
    SELECT
    t.tag_nev,
    t.szuletesi_datum,
    t.allampolgarsag,
    t.poszt,
    t.csapat_id
  FROM
    tagok t
  JOIN
    (SELECT csapat_id
    FROM csapatok
    ORDER BY alapitas_ev
    LIMIT 1) as legregebbi_csapat
  ON
    t.csapat_id = legregebbi_csapat.csapat_id;`,
    {
      type: QueryTypes.SELECT,
    }
  );
  const result3 = await sequelize.query(
    `SELECT 
  c.csapat_nev,
  COALESCE(SUM(CASE WHEN m.eredmeny = c.csapat_id THEN 1 ELSE 0 END), 0) AS Gyozelmek,
  COALESCE(SUM(CASE WHEN m.csapat1_id = c.csapat_id AND m.eredmeny != c.csapat_id THEN 1 
                     WHEN m.csapat2_id = c.csapat_id AND m.eredmeny != c.csapat_id THEN 1
                     ELSE 0 END), 0) AS Veresegek
FROM 
  csapatok c
LEFT JOIN 
  merkozesek m ON c.csapat_id = m.csapat1_id OR c.csapat_id = m.csapat2_id
GROUP BY 
  c.csapat_nev;`
  );
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
    result2: result2,
    result3: result3,
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
//TODO Al lekérdezés
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
exports.getTagok = async (req, res) => {
  const result = await sequelize.query(`SELECT * FROM tagok`, {
    type: QueryTypes.SELECT,
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
//TODO LEFT JOIN több mint 2 táblás lekérdezés
exports.getOtLegfiatalabbTag = async (req, res) => {
  const result = await sequelize.query(
    `SELECT tagok.tag_nev,tagok.szuletesi_datum,tagok.allampolgarsag,tagok.poszt, csapatok.csapat_nev FROM tagok LEFT JOIN csapatok ON csapatok.csapat_id = tagok.csapat_id GROUP BY tagok.tag_nev ORDER BY szuletesi_datum DESC LIMIT 5`,
    {
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
//TODO INNER JOIN több mint 2 táblás lekérdezés
exports.getMerkozesek = async (req, res) => {
  const result = await sequelize.query(
    `
    SELECT 
      m.merkozes_id,
      m.datum,
      c1.csapat_nev AS csapat1_nev,
      c2.csapat_nev AS csapat2_nev,
      m.helyszin,
      m.eredmeny
    FROM merkozesek m
    INNER JOIN csapatok c1 ON m.csapat1_id = c1.csapat_id
    INNER JOIN csapatok c2 ON m.csapat2_id = c2.csapat_id
  `,
    {
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
//TODO INNER JOIN több mint 2 táblás lekérdezés
exports.getHetnapMerkozesek = async (req, res) => {
  const currentDate = new Date();
  const sevenDaysLater = new Date(
    currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
  );
  const result = await sequelize.query(
    `SELECT 
      m.merkozes_id,
      m.datum,
      c1.csapat_nev AS csapat1_nev,
      c2.csapat_nev AS csapat2_nev,
      m.helyszin,
      m.eredmeny
    FROM merkozesek m
    INNER JOIN csapatok c1 ON m.csapat1_id = c1.csapat_id
    INNER JOIN csapatok c2 ON m.csapat2_id = c2.csapat_id WHERE m.datum BETWEEN :currentDate AND :sevenDaysLater`,
    {
      replacements: {
        currentDate: currentDate,
        sevenDaysLater: sevenDaysLater,
      },
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
