const express = require("express");
const app = express();
const cors = require("cors");
const { urlencoded } = require("body-parser");

require("dotenv").config();
app.use(cors());
app.use(urlencoded({ extened: true }));
app.use(express.json());
app.use(cors({ exposedHeaders: "adatok" }));
app.use("/auth", require("./Routes/auth.routes"));
app.use("/home", require("./Routes/home.routes"));
app.get("/alma", async (req, res) => {
  return res.send({ success: true, msg: "alma" });
});

app.listen(process.env.PORT, () => {
  console.log(`A szerver fut a(z) ${process.env.PORT} porton.`);
});
