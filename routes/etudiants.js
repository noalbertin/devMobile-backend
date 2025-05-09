const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM etudiants", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { numEt, nom, moyenne } = req.body;
  db.query("INSERT INTO etudiants (numEt, nom, moyenne) VALUES (?, ?, ?)", [numEt, nom, moyenne], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(201);
  });
});

router.put("/:id", (req, res) => {
  const { numEt, nom, moyenne } = req.body;
  db.query("UPDATE etudiants SET numEt=?, nom=?, moyenne=? WHERE id=?", [numEt, nom, moyenne, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM etudiants WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

router.get("/stats", (req, res) => {
  const sql = `SELECT 
                ROUND(AVG(moyenne), 2) AS moyenne_classe, 
                ROUND(MIN(moyenne), 2) AS min_moyenne, 
                ROUND(MAX(moyenne), 2) AS max_moyenne 
              FROM etudiants`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results[0]);
  });
});

router.post("/check", (req, res) => {
  const { numEt, nom, id } = req.body;

  const sql = `
    SELECT * FROM etudiants 
    WHERE (numEt = ? OR nom = ?) 
    ${id ? 'AND id != ?' : ''}
  `;
  const params = id ? [numEt, nom, id] : [numEt, nom];

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).send(err);
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
  });
});





module.exports = router;