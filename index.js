require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const etudiantsRoute = require("./routes/etudiants");
const port = process.env.PORT || 3000;

// Configuration CORS plus sécurisée
const corsOptions = {
    origin: '*', // autorise toutes les origines pour le dev
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
  };
  

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de santé pour vérifier que l'API est opérationnelle
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', environment: process.env.NODE_ENV });
});

app.use("/etudiants", etudiantsRoute);

// Gestion des erreurs centralisée
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API en marche sur http://0.0.0.0:${port}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});