const express = require("express");
const cors = require("cors");   // ✅ 1. REQUIRE CORS
const app = express();          // ✅ 2. CREATE APP

// ✅ 3. ADD CORS HERE (RIGHT AFTER app)
app.use(
  cors({
    origin: "*", // allow Netlify + localhost
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// ✅ 4. OTHER MIDDLEWARE
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

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
