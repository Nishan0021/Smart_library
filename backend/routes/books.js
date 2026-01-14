const express = require("express");
const router = express.Router();
const db = require("../db");

// ✅ Get all books
router.get("/", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }
    res.json(results);
  });
});

// ✅ Add new book
router.post("/add", (req, res) => {
  const { title, author, copies } = req.body;

  if (!title || !author || !copies) {
    return res.status(400).send("Missing data");
  }

  // Insert into books table
  db.query(
    "INSERT INTO books (title, author, total_copies, available_copies) VALUES (?, ?, ?, ?)",
    [title, author, copies, copies],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Insert failed");
      }

      const bookId = result.insertId;

      // Insert physical copies
      for (let i = 0; i < copies; i++) {
        db.query(
          "INSERT INTO book_copies (book_id) VALUES (?)",
          [bookId]
        );
      }

      res.send("Book added successfully");
    }
  );
});
// DASHBOARD COUNTS
router.get("/counts", (req, res) => {
  const query = `
  SELECT
    (SELECT SUM(total_copies) FROM books) AS total_books,
    (SELECT COUNT(*) FROM issued_books WHERE return_date IS NULL) AS issued_books,
    (SELECT SUM(available_copies) FROM books) AS available_books
`;

  db.query(query, (err, result) => {
    if (err) return res.status(500).send("Database error");
    res.json(result[0]);
  });
});

module.exports = router;
