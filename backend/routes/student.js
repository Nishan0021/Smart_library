const express = require("express");
const router = express.Router();
const db = require("../db");

/* =========================
   STUDENT LOGIN (USN ONLY)
   ========================= */
router.post("/login", (req, res) => {
  const { usn } = req.body;

  if (!usn) {
    return res.status(400).json({ message: "USN required" });
  }

  const sql = "SELECT usn, student_name FROM students WHERE usn = ?";

  db.query(sql, [usn], (err, results) => {
    if (err) {
      console.error("❌ LOGIN DB ERROR:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid USN" });
    }

    return res.json({
      success: true,
      usn: results[0].usn,
      student_name: results[0].student_name,
    });
  });
});

/* =========================
   STUDENT ISSUED BOOKS
   ========================= */
router.get("/issued/:usn", (req, res) => {
  const usn = req.params.usn;

  const sql = `
    SELECT 
      b.title,
      i.issue_date,
      i.return_date,
      i.fine_amount
    FROM issued_books i
    JOIN books b ON i.book_id = b.book_id
    WHERE i.student_usn = ?
  `;

  db.query(sql, [usn], (err, results) => {
    if (err) {
      console.error("❌ ISSUED DB ERROR:", err.message);
      return res.status(500).json({ message: "Database error" });
    }

    return res.json(results);
  });
});

module.exports = router;
