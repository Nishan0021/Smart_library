const express = require("express");
const router = express.Router();
const supabase = require("../db");

/* =========================
   ✅ ISSUE BOOK
   ========================= */
router.post("/issue", async (req, res) => {
  const { book_id, student_usn, student_name } = req.body;

  if (!book_id || !student_usn || !student_name) {
    return res.status(400).json({ message: "Missing data" });
  }

  // 1️⃣ Check book availability
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("available_copies")
    .eq("book_id", book_id)
    .single();

  if (bookError || !book || book.available_copies <= 0) {
    return res.status(400).json({ message: "No copies available" });
  }

  // 2️⃣ Insert into issued_books
  const { error: issueError } = await supabase.from("issued_books").insert([
    {
      book_id,
      student_usn,
      student_name,
      issue_date: new Date(),
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      fine_amount: 0,
    },
  ]);

  if (issueError) {
    console.error("❌ ISSUE ERROR:", issueError.message);
    return res.status(500).json({ message: "Database error" });
  }

  // 3️⃣ Reduce available copies
  await supabase
    .from("books")
    .update({ available_copies: book.available_copies - 1 })
    .eq("book_id", book_id);

  res.json({ success: true, message: "Book issued successfully" });
});

/* =========================
   ✅ RETURN BOOK (WITH FINE)
   ========================= */
router.post("/return", async (req, res) => {
  const { issue_id } = req.body;

  if (!issue_id) {
    return res.status(400).json({ message: "Missing issue_id" });
  }

  // 1️⃣ Get issue record
  const { data: issue, error } = await supabase
    .from("issued_books")
    .select("*")
    .eq("id", issue_id)
    .is("return_date", null)
    .single();

  if (error || !issue) {
    return res.status(400).json({ message: "Invalid return request" });
  }

  // 2️⃣ Calculate fine
  const today = new Date();
  const dueDate = new Date(issue.due_date);
  let fine = 0;

  if (today > dueDate) {
    const daysLate = Math.ceil(
      (today - dueDate) / (1000 * 60 * 60 * 24)
    );
    fine = daysLate * 5; // ₹5 per day
  }

  // 3️⃣ Update issued_books
  await supabase
    .from("issued_books")
    .update({
      return_date: today,
      fine_amount: fine,
    })
    .eq("id", issue_id);

  // 4️⃣ Increase available copies
  const { data: book } = await supabase
    .from("books")
    .select("available_copies")
    .eq("book_id", issue.book_id)
    .single();

  await supabase
    .from("books")
    .update({ available_copies: book.available_copies + 1 })
    .eq("book_id", issue.book_id);

  res.json({
    success: true,
    message: "Book returned successfully",
    fine,
  });
});

/* =========================
   ✅ ADMIN: VIEW ALL ISSUED BOOKS
   ========================= */
router.get("/issued-list", async (req, res) => {
  const { data, error } = await supabase
    .from("issued_books")
    .select(`
      id,
      issue_date,
      due_date,
      return_date,
      fine_amount,
      student_name,
      student_usn,
      books ( title )
    `)
    .order("issue_date", { ascending: false });

  if (error) {
    console.error("❌ ISSUED LIST ERROR:", error.message);
    return res.status(500).json({ message: "Database error" });
  }

  res.json(data);
});

/* =========================
   ✅ STUDENT DASHBOARD (BY USN)
   ========================= */
router.get("/student/:usn", async (req, res) => {
  const { usn } = req.params;

  const { data, error } = await supabase
    .from("issued_books")
    .select(`
      issue_date,
      due_date,
      return_date,
      fine_amount,
      books ( title )
    `)
    .eq("student_usn", usn)
    .order("issue_date", { ascending: false });

  if (error) {
    console.error("❌ STUDENT DASHBOARD ERROR:", error.message);
    return res.status(500).json({ message: "Database error" });
  }

  res.json(data);
});

module.exports = router;
