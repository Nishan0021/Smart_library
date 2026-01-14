const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = require("./db");

// Routes
const booksRoutes = require("./routes/books");
const issueRoutes = require("./routes/issue");
const adminRoutes = require("./routes/admin");   // ✅ ADMIN ROUTE

// Use routes
app.use("/books", booksRoutes);
app.use("/issue", issueRoutes);
app.use("/admin", adminRoutes);                   // ✅ ADMIN ROUTE USED

// Test route
app.get("/", (req, res) => {
  res.send("Smart Library Backend Running");
});

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
