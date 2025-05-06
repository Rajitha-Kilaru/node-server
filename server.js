const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));

// MySQL connection
let db;

async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: "shuttle.proxy.rlwy.net",
      user: "root",
      password: "iEtjhmArGQkbplAqrqPeFQTCuSyRRgGX",
      database: "railway",
      port: 28682,
    });
    console.log("Connected to Railway MySQL");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the app if DB fails
  }
}

connectDB();

// List all students
app.get("/list", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM students");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new student
app.post("/newData", async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    const [result] = await db.execute(
      "INSERT INTO students (Name, Email, Mobile) VALUES (?, ?, ?)",
      [name, email, mobile]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Read a single student
app.get("/read/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM students WHERE ID = ?", [
      req.params.id,
    ]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a student
app.put("/update/:id", async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    const [result] = await db.execute(
      "UPDATE students SET Name=?, Email=?, Mobile=? WHERE ID = ?",
      [name, email, mobile, req.params.id]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Delete a student
app.delete("/delete/:id", async (req, res) => {
  try {
    const [result] = await db.execute("DELETE FROM students WHERE ID = ?", [
      req.params.id,
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(8081, () => {
  console.log("Server running successfully on port 8081");
});
