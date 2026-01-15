const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* =======================
   CORS
   ======================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

/* =======================
   ROUTES
   ======================= */
app.use("/student", require("./routes/student"));
app.use("/admin", require("./routes/admin"));
app.use("/books", require("./routes/books"));
app.use("/issue", require("./routes/issue"));

/* =======================
   TEST ROUTE
   ======================= */
app.get("/", (req, res) => {
  res.send("✅ Smart Library Backend Running");
});

/* =======================
   START SERVER
   ======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
