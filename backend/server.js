const express = require("express");
const cors = require("cors");
const app = express();

/* =======================
   CORS CONFIG (IMPORTANT)
   ======================= */
app.use(
  cors({
    origin: "*",            // allow all origins (Netlify, localhost, etc.)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
  })
);

// Middleware
app.use(express.json());

// Database
const db = require("./db");

// Routes
const booksRoutes = require("./routes/books");
const issueRoutes = require("./routes/issue");
const adminRoutes = require("./routes/admin");

// Use routes
app.use("/books", booksRoutes);
app.use("/issue", issueRoutes);
app.use("/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Smart Library Backend Running");
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
