const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "sql.freedb.tech",
  user: "freedb_smart_library",
  password: "KesEa7$?EY?@gVK",   // exactly as FreeDB
  database: "freedb_MySQL",
  port: 3306,
  connectTimeout: 10000
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed:", err.message);
  } else {
    console.log("✅ Connected to FreeDB MySQL");
  }
});

module.exports = db;