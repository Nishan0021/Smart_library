const express = require("express");
const router = express.Router();
const supabase = require("../db");

/* =========================
   ✅ GET ALL BOOKS
   ========================= */
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .order("book_id", { ascending: true });

  if (error) {
    console.error("❌ GET BOOKS ERROR:", error.message);
    return res.status(500).json({ message: "Database error" });
  }

  res.json(data);
});

/* =========================
   ✅ ADD NEW BOOK
   ========================= */
router.post("/add", async (req, res) => {
  const { title, author, category } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "Title & author required" });
  }

  const { error } = await supabase.from("books").insert([
    {
      title,
      author,
      category,
    },
  ]);

  if (error) {
    console.error("❌ ADD BOOK ERROR:", error.message);
    return res.status(500).json({ message: "Database error" });
  }

  res.json({ success: true, message: "Book added successfully" });
});

module.exports = router;
