require("dotenv").config();
const mysql = require("mysql2");
const config = require('./config')[process.env.NODE_ENV || 'development'];
const isProduction = process.env.NODE_ENV === 'production';

const dbConfig = {
  host: config.DB_HOST,
  port: Number(config.DB_PORT),
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  ssl: {
    rejectUnauthorized: true,
    minVersion: 'TLSv1.2'
  },
  connectTimeout: 10000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


// Création d'un pool de connexions plutôt qu'une seule connexion
const pool = mysql.createPool(dbConfig);

// Test de la connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erreur de connexion à la base :", err.message);
    process.exit(1);
  }
  console.log(`✅ Connecté à la base MySQL (${isProduction ? "Production - TiDB Cloud" : "Développement - Local"})`);
  connection.release();
});

module.exports = pool.promise();