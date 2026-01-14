const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Nishan@2005",      // put MySQL password if you have one
  database: "smart_library"
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed ❌");
    console.error(err);
    return;
  }
  console.log("MySQL Connected ✅");
});

module.exports = db;
