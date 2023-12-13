const { where } = require("sequelize");
const sequelize = require("../Models/connection.modell");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const { dateToString } = require("../Services/date.service");
const {
  lengthCheck,
  numberCheck,
  lowerUpperCheck,
} = require("../Services/pass.service");
exports.felhasznaloBelepes = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    const t = await sequelize.transaction();
    //Beérkezett adatok vizsgálata
    if (!Email || !Password) {
      return res.send({
        success: false,
        msg: "Nem adtál meg minden adatot!",
      });
    }
    //Felhasználó lekérése
    const users = await sequelize.query(
      `SELECT * FROM felhasznalok WHERE email = :email Limit 1`,
      {
        replacements: { email: Email },
        type: QueryTypes.SELECT,
        transaction: t,
      }
    );
    const user = users[0];
    //console.log(user);
    //console.log(hashPassword);
    if (!user) {
      await t.rollback();
      return res.send({ success: false, msg: "Helytelen E-mail vagy jelszó!" });
    }
    //Felhasználó jelszavának vizsgálata
    const isSame = await bcrypt.compare(Password, user.jelszo);

    if (!isSame) {
      await t.rollback();
      return res.send({ success: false, msg: "Rossz jelszót adtál meg" });
    }
    await t.commit();
    return res.set({ adatok: user.felhasznalo_nev }).send({
      success: true,
      msg: "Sikeres bejelentkezés!",
      username: user.felhasznalo_nev,
    });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, msg: "Fatal Error! " + error });
  }
};
exports.felhasznaloRegisztracio = async (req, res) => {
  const t = await sequelize.transaction();
  const { UserName, Password, Password2, Email } = req.body;
  if (!UserName || !Email) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Hiányzó e-mail cím!",
    });
  }
  //ha email címek eggyeznek
  if (Password != Password2) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "A két jelszó nem azonos!",
    });
  }
  if (!lengthCheck(Password)) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "A jelszó legalább 8 karater hosszúnak kell lennie!",
    });
  }
  if (!numberCheck(Password)) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "A jelszónak tartalmaznia kell számot!",
    });
  }
  if (!lowerUpperCheck(Password)) {
    return res.send({
      success: false,
      msg: "A jelszónak nagy és kis betűket is kell tartalmaznia!",
    });
  }
  const hashPassword = await bcrypt.hash(Password, 10);
  const emailCheck = await sequelize.query(
    `SELECT * FROM felhasznalok WHERE email = :email Limit 1`,
    {
      replacements: { email: Email },
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );
  const userNameCheck = await sequelize.query(
    `SELECT * FROM felhasznalok WHERE felhasznalo_nev = :username Limit 1`,
    {
      replacements: { username: UserName },
      type: QueryTypes.SELECT,
      transaction: t,
    }
  );

  if (userNameCheck.length > 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Ez a felhasználó név foglalt!",
    });
  }
  if (emailCheck.length > 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Ez az email cím foglalt!",
    });
  }

  const insertUser = await sequelize.query(
    `INSERT INTO felhasznalok (felhasznalo_nev, jelszo, email, nev) VALUES (:username, :password, :email, :teljesnev)`,
    {
      replacements: {
        username: UserName,
        password: hashPassword,
        email: Email,
        teljesnev: UserName,
      },
      type: QueryTypes.INSERT,
      transaction: t,
    }
  );

  if (!insertUser) {
    await t.rollback();
    return res.send({ success: false, msg: "Sikertelen regisztráció!" });
  }

  await t.commit();
  return res.send({ success: true, msg: "Sikeres regisztráció!" });
};
exports.tagCsapatKilepes = async (req, res) => {
  const tag_id = req.params.id;
  const t = await sequelize.transaction();
  const tag = await sequelize.query(
    `UPDATE tagok SET csapat_id = NULL WHERE tag_id = :tag_id`,
    {
      replacements: { tag_id: tag_id },
      type: QueryTypes.UPDATE,
      transaction: t,
    }
  );
  if (!tag) {
    await t.rollback();
    return res.send({ success: false, msg: "Sikertelen adatmódosítás!" });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres adatmódosítás!" });
};
exports.csapatModositas = async (req, res) => {
  const { csapat_nev, varos, alapitas_ev } = req.body;
  const csapat_id = req.params.id;
  const t = await sequelize.transaction();
  const [csapat, metadata] = await sequelize.query(
    `UPDATE csapatok SET csapat_nev = :csapat_nev, varos = :varos, alapitas_ev = :alapitas_ev WHERE csapat_id = :csapat_id`,
    {
      replacements: {
        csapat_nev: csapat_nev,
        varos: varos,
        alapitas_ev: alapitas_ev,
        csapat_id: csapat_id,
      },
      type: QueryTypes.UPDATE,
      transaction: t,
    }
  );
  if (metadata === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen csapat adatmódosítás!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres csapat adatmódosítás!" });
};
exports.csapatTorles = async (req, res) => {
  const csapat_id = req.params.id;
  const t = await sequelize.transaction();
  const tagok = await sequelize.query(
    `UPDATE tagok SET csapat_id = NULL WHERE csapat_id = :csapat_id`,
    {
      replacements: { csapat_id: csapat_id },
      type: QueryTypes.UPDATE,
      transaction: t,
    }
  );
  const result = await sequelize.query(
    `DELETE FROM csapatok WHERE csapat_id = :csapat_id`,
    {
      replacements: { csapat_id: csapat_id },
      type: QueryTypes.DELETE,
      transaction: t,
    }
  );
  //const metadata = result;
  //itt ez fölösleges mert undefined et ad vissza
  if (result === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen csapat törlés!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres csapat törlés!" });
};
exports.getTagokFelvetelhez = async (req, res) => {
  const result = await sequelize.query(
    `SELECT * FROM tagok WHERE csapat_id IS NULL`,
    {
      type: QueryTypes.SELECT,
    }
  );
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
  });
};
exports.csapatTagHozzaadas = async (req, res) => {
  const { csapat_id, tag_id } = req.params;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `UPDATE tagok SET csapat_id = :csapat_id WHERE tag_id = :tag_id`,
    {
      replacements: { csapat_id: csapat_id, tag_id: tag_id },
      type: QueryTypes.UPDATE,
      transaction: t,
    }
  );
  if (result === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen csapat-tag hozzaadás!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres csapat-tag hozzaadás!" });
};
exports.UjTag = async (req, res) => {
  const { Tag_nev, Szuletesi_datum, Allampolgarsag, Poszt } = req.body;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `INSERT INTO tagok (tag_nev, szuletesi_datum, allampolgarsag, poszt) VALUES (:Tag_nev, :Szuletesi_datum, :Allampolgarsag, :Poszt)`,
    {
      replacements: {
        Tag_nev: Tag_nev,
        Szuletesi_datum: Szuletesi_datum,
        Allampolgarsag: Allampolgarsag,
        Poszt: Poszt,
      },
      type: QueryTypes.INSERT,
      transaction: t,
    }
  );
  //console.log(result);
  if (result[1] === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen Tag felvétel!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres Tag felvétel!" });
};

exports.tagTorles = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();
  const result = await sequelize.query(`DELETE FROM tagok WHERE tag_id = :id`, {
    replacements: { id: id },
    type: QueryTypes.DELETE,
    transaction: t,
  });
  if (result === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen tag törlés!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres tag törlés!" });
};
exports.getEgyTag = async (req, res) => {
  const id = req.params.id;
  const result = await sequelize.query(
    `SELECT * FROM tagok WHERE tag_id = :id`,
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
exports.egyTagModositas = async (req, res) => {
  const { Tag_nev, Szuletesi_datum, Allampolgarsag, Poszt } = req.body;
  const id = req.params.id;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `UPDATE tagok SET tag_nev = :Tag_nev, szuletesi_datum = :Szuletesi_datum, allampolgarsag = :Allampolgarsag, poszt = :Poszt WHERE tag_id = :id`,
    {
      replacements: {
        Tag_nev: Tag_nev,
        Szuletesi_datum: Szuletesi_datum,
        Allampolgarsag: Allampolgarsag,
        Poszt: Poszt,
        id: id,
      },
      type: QueryTypes.UPDATE,
      transaction: t,
    }
  );
  if (result === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen tag módosítás!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres tag módosítás!" });
};
exports.UjCsapat = async (req, res) => {
  const { csapat_nev, varos, alapitasi_ev } = req.body;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `INSERT INTO csapatok (csapat_nev, varos, alapitas_ev) VALUES (:csapat_nev, :varos, :alapitasi_ev)`,
    {
      replacements: {
        csapat_nev: csapat_nev,
        varos: varos,
        alapitasi_ev: alapitasi_ev,
      },
      type: QueryTypes.INSERT,
      transaction: t,
    }
  );
  if (result[1] === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen csapat felvétel!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres csapat felvétel!" });
};
exports.merkozesTorles = async (req, res) => {
  const id = req.params.id;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `DELETE FROM merkozesek WHERE merkozes_id = :id`,
    {
      replacements: { id: id },
      type: QueryTypes.DELETE,
      transaction: t,
    }
  );
  if (result === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen mérkőzés törlése!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres mérkőzés törlése!" });
};
exports.getEgyMerkozes = async (req, res) => {
  const id = req.params.id;
  const result = await sequelize.query(
    `SELECT * FROM merkozesek WHERE merkozes_id = :id`,
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
exports.egyMerkozesModositas = async (req, res) => {
  const { helyszin, datum, csapat1, csapat2, eredmeny } = req.body;
  const id = req.params.id;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `UPDATE merkozesek SET helyszin = :helyszin, datum = :datum, csapat1_id = :csapat1, csapat2_id = :csapat2, eredmeny = :eredmeny WHERE merkozes_id = :id`,
    {
      replacements: {
        helyszin: helyszin,
        datum: datum,
        csapat1: csapat1,
        csapat2: csapat2,
        eredmeny: eredmeny,
        id: id,
      },
      type: QueryTypes.UPDATE,
      transaction: t,
    }
  );
  if (result === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen mérkőzés módosítás!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres mérkőzés módosítás!" });
};
exports.egyMerkozesHozzaadas = async (req, res) => {
  const { helyszin, datum, csapat1, csapat2 } = req.body;
  const t = await sequelize.transaction();
  const result = await sequelize.query(
    `INSERT INTO merkozesek (helyszin, datum, csapat1_id, csapat2_id) VALUES (:helyszin, :datum, :csapat1, :csapat2)`,
    {
      replacements: {
        helyszin: helyszin,
        datum: datum,
        csapat1: csapat1,
        csapat2: csapat2,
      },
      type: QueryTypes.INSERT,
      transaction: t,
    }
  );
  if (result[1] === 0) {
    await t.rollback();
    return res.send({
      success: false,
      msg: "Sikertelen mérkőzés felvétel!",
    });
  }
  await t.commit();
  return res.send({ success: true, msg: "Sikeres mérkőzés felvétel!" });
};
exports.getEgyCsapatTagokSzamaAllampolgarsagSzerint = async (req, res) => {
  const csapatId = req.params.id;
  const result = await sequelize.query(
    `
      SELECT t.allampolgarsag, COUNT(*) AS tagok_szama
      FROM tagok AS t
      WHERE t.csapat_id = :csapatId
      GROUP BY t.allampolgarsag
      `,
    {
      replacements: { csapatId: csapatId },
      type: QueryTypes.SELECT,
    }
  );
  if (!result || result.length === 0) {
    return res.send({
      success: false,
      msg: "Nincs ilyen csapat, vagy nincsenek tagok.",
    });
  }
  return res.send({
    success: true,
    msg: "Sikeres lekérdezés",
    result: result,
  });
};
