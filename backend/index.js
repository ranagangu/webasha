import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* CREATE */
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ POST /users error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* READ */
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ GET /users error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE */
app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *",
      [name, email, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ PUT /users error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* DELETE */
app.delete("/users/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM users WHERE id=$1",
      [req.params.id]
    );
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("❌ DELETE /users error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
