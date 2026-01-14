const express = require("express");
const router = express.Router();
const db = require("../db");

/* ================= STUDENT LOGIN (USN VALIDATION) ================= */
router.post("/student-login", (req, res) => {
  const { usn } = req.body;

  if (!usn) {
    return res.status(400).send("USN required");
  }

  db.query(
    "SELECT * FROM students WHERE usn = ?",
    [usn],
    (err, result) => {
      if (err) return res.status(500).send("Database error");

      if (result.length === 0) {
        return res.status(401).send("Invalid USN. Access denied.");
      }

      res.json({
        message: "Login successful",
        usn: result[0].usn,
        student_name: result[0].student_name
      });
    }
  );
});

/* ================= ISSUE BOOK ================= */
router.post("/issue", (req, res) => {
  const { book_id, student_usn, student_name } = req.body;

  if (!book_id || !student_usn || !student_name) {
    return res.status(400).send("Missing data");
  }

  db.query(
    "SELECT copy_id FROM book_copies WHERE book_id=? AND status='Available' LIMIT 1",
    [book_id],
    (err, result) => {
      if (err) return res.status(500).send("Database error");

      if (result.length === 0) {
        return res.send("No copies available");
      }

      const copyId = result[0].copy_id;

      db.query(
        "UPDATE book_copies SET status='Issued' WHERE copy_id=?",
        [copyId]
      );

     db.query(
  `INSERT INTO issued_books 
   (copy_id, student_usn, student_name, issue_date, due_date, fine_amount) 
   VALUES (?, ?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), 0)`,
  [copyId, student_usn, student_name]
);


      db.query(
        "UPDATE books SET available_copies = available_copies - 1 WHERE book_id=?",
        [book_id]
      );

      res.send("Book issued successfully");
    }
  );
});

/* ================= RETURN BOOK (WITH FINE) ================= */
router.post("/return", (req, res) => {
  const { copy_id } = req.body;

  if (!copy_id) {
    return res.status(400).send("Missing copy_id");
  }

  // Get due date
  db.query(
    "SELECT due_date FROM issued_books WHERE copy_id=? AND return_date IS NULL",
    [copy_id],
    (err, result) => {
      if (err) return res.status(500).send("Database error");

      if (result.length === 0) {
        return res.status(400).send("Invalid return request");
      }

      const dueDate = result[0].due_date;

      // Calculate late days
      const query = `
        UPDATE issued_books
        SET 
          return_date = CURDATE(),
          fine_amount = 
            CASE 
              WHEN CURDATE() > due_date 
              THEN DATEDIFF(CURDATE(), due_date) * 5
              ELSE 0
            END
        WHERE copy_id = ? AND return_date IS NULL
      `;

      db.query(query, [copy_id], err => {
        if (err) return res.status(500).send("Fine update error");

        // Mark copy as available
        db.query(
          "UPDATE book_copies SET status='Available' WHERE copy_id=?",
          [copy_id]
        );

        // Increase available copies
        db.query(
          `UPDATE books 
           SET available_copies = available_copies + 1
           WHERE book_id = (SELECT book_id FROM book_copies WHERE copy_id=?)`,
          [copy_id]
        );

        res.send("Book returned successfully with fine calculated");
      });
    }
  );
});


/* ================= ADMIN: VIEW ALL ISSUED BOOKS ================= */
router.get("/issued-list", (req, res) => {
  const query = `
  SELECT 
    ib.copy_id,
    b.title AS book_title,
    ib.student_name,
    ib.student_usn,
    ib.issue_date,
    ib.due_date,
    ib.return_date,
    ib.fine_amount
  FROM issued_books ib
  JOIN book_copies bc ON ib.copy_id = bc.copy_id
  JOIN books b ON bc.book_id = b.book_id
  ORDER BY ib.issue_date DESC
`;


  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.json(results);
  });
});

/* ================= STUDENT DASHBOARD (BY USN) ================= */
router.get("/student/:usn", (req, res) => {
  const usn = req.params.usn;

  const query = `
    SELECT 
      b.title AS book_title,
      ib.issue_date,
      ib.due_date,
      ib.return_date,
      ib.fine_amount
    FROM issued_books ib
    JOIN book_copies bc ON ib.copy_id = bc.copy_id
    JOIN books b ON bc.book_id = b.book_id
    WHERE ib.student_usn = ?
    ORDER BY ib.issue_date DESC
  `;

  db.query(query, [usn], (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.json(results);
  });
});

module.exports = router;
