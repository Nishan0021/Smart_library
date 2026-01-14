const express = require("express");
const router = express.Router();
const db = require("../db");

// ADMIN LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing credentials");
  }

  db.query(
    "SELECT * FROM admin WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).send("Database error");

      if (result.length === 0) {
        return res.status(401).send("Invalid admin credentials");
      }

      res.json({
        message: "Admin login successful",
        admin: username
      });
    }
  );
});

module.exports = router;
