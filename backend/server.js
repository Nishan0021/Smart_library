const express = require("express");
const cors = require("cors");

const app = express();

/* =======================
   ✅ CORS CONFIG (FIXED)
   ======================= */
app.use(
  cors({
    origin: "*", // allow Netlify, Render, localhost
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* =======================
   ✅ BODY PARSER
   ======================= */
app.use(express.json());

/* =======================
   ✅ DATABASE
   ======================= */
const db = require("./db");

/* =======================
   ✅ ROUTES
   ======================= */
const booksRoutes = require("./routes/books");
const issueRoutes = require("./routes/issue");
const adminRoutes = require("./routes/admin");
const studentRoutes = require("./routes/student");

/* =======================
   ✅ USE ROUTES
   ======================= */
app.use("/books", booksRoutes);
app.use("/issue", issueRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

/* =======================
   ✅ TEST ROUTE
   ======================= */
app.get("/", (req, res) => {
  res.send("✅ Smart Library Backend Running");
});

/* =======================
   ✅ START SERVER
   ======================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
