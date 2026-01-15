const express = require("express");
const router = express.Router();

// ADMIN LOGIN API
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 🔐 ADMIN CREDENTIALS (SET HERE)
  if (username === "admin" && password === "admin123") {
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false });
  }
});

module.exports = router;
