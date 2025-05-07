const express = require("express");
const cors = require("cors");
const app = express();
const etudiantsRoute = require("./routes/etudiants");

app.use(cors());
app.use(express.json());
app.use("/etudiants", etudiantsRoute);

app.listen(5000, '0.0.0.0', () => {
    console.log("API en marche sur http://0.0.0.0:5000");
});
  