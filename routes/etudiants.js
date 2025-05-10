const express = require("express");
const router = express.Router();
const db = require("../db");

// GET - Tous les étudiants
router.get("/", async (req, res, next) => {
  try {
    const [results] = await db.query("SELECT * FROM etudiants");
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// POST - Ajouter un étudiant
router.post("/", async (req, res, next) => {
  try {
    const { numEt, nom, moyenne } = req.body;
    await db.query(
      "INSERT INTO etudiants (numEt, nom, moyenne) VALUES (?, ?, ?)",
      [numEt, nom, moyenne]
    );
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
});

// PUT - Mettre à jour un étudiant
router.put("/:id", async (req, res, next) => {
  try {
    const { numEt, nom, moyenne } = req.body;
    await db.query(
      "UPDATE etudiants SET numEt=?, nom=?, moyenne=? WHERE id=?",
      [numEt, nom, moyenne, req.params.id]
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// DELETE - Supprimer un étudiant
router.delete("/:id", async (req, res, next) => {
  try {
    await db.query("DELETE FROM etudiants WHERE id=?", [req.params.id]);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

// GET - Statistiques
router.get("/stats", async (req, res, next) => {
  try {
    const [results] = await db.query(`
      SELECT 
        ROUND(AVG(moyenne), 2) AS moyenne_classe, 
        ROUND(MIN(moyenne), 2) AS min_moyenne, 
        ROUND(MAX(moyenne), 2) AS max_moyenne 
      FROM etudiants
    `);
    res.json(results[0]);
  } catch (err) {
    next(err);
  }
});

// POST - Vérification d'unicité
router.post("/check", async (req, res, next) => {
  try {
    const { numEt, nom, id } = req.body;

    const sql = `
      SELECT * FROM etudiants 
      WHERE (numEt = ? OR nom = ?) 
      ${id ? 'AND id != ?' : ''}
    `;
    const params = id ? [numEt, nom, id] : [numEt, nom];

    const [results] = await db.query(sql, params);

    if (results.length > 0) {
      const conflict = results[0];
      const conflicts = [];
      if (conflict.numEt === numEt) conflicts.push("numEt");
      if (conflict.nom === nom) conflicts.push("nom");

      return res.status(409).json({
        message: "Conflit détecté",
        fields: conflicts
      });
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
