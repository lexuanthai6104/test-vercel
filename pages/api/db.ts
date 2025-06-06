import sqlite3 from "sqlite3";

// Khai báo kiểu cho `db`
const db: sqlite3.Database = new sqlite3.Database("sensorData.db", (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Tạo bảng nếu chưa tồn tại
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS sensor_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      salinity REAL,
      pH REAL,
      turbidity REAL,
      temperature REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
