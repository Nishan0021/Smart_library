const express = require("express");
const router = express.Router();
const supabase = require("../db");

/* =========================
   STUDENT LOGIN (USN ONLY)
   ========================= */
router.post("/login", async (req, res) => {
  const { usn } = req.body;

  if (!usn) {
    return res.status(400).json({ message: "USN required" });
  }

  const { data, error } = await supabase
    .from("students")
    .select("usn, student_name")
    .eq("usn", usn)
    .single();

  if (error) {
    console.error("❌ SUPABASE ERROR:", error.message);
    return res.status(500).json({ message: "Database error" });
  }

  if (!data) {
    return res.status(401).json({ message: "Invalid USN" });
  }

  res.json({
    success: true,
    usn: data.usn,
    student_name: data.student_name,
  });
});

/* =========================
   ✅ STUDENT ISSUED BOOKS
   ========================= */
router.get("/issued/:usn", async (req, res) => {
  const { usn } = req.params;

  const { data, error } = await supabase
    .from("issued_books")
    .select(`
      issue_date,
      return_date,
      fine_amount,
      books ( title )
    `)
    .eq("student_usn", usn);

  if (error) {
    console.error("❌ ISSUED BOOKS ERROR:", error.message);
    return res.status(500).json({ message: "Database error" });
  }

  res.json(data);
});

module.exports = router;
