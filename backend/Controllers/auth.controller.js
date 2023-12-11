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
