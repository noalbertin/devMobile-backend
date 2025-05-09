require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const etudiantsRoute = require("./routes/etudiants");
const port = process.env.PORT || 3000;


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/etudiants", etudiantsRoute);

app.listen(port, '0.0.0.0', () => {
    console.log(`API en marche sur http://0.0.0.0:${port}`);
});

  