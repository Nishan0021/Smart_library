const express = require("express");
const router = express.Router();
const supabase = require("../db");

/* =========================
   ADMIN LOGIN
   ========================= */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  try {
    const { data, error } = await supabase
      .from("admins")
      .select("id, username")
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({
      success: true,
      admin_id: data.id,
      username: data.username,
    });
  } catch (err) {
    console.error("❌ ADMIN LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
