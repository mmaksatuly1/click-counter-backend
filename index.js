import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW()
  )
`);

app.post("/click", async (req, res) => {
  await pool.query("INSERT INTO clicks DEFAULT VALUES");
  res.json({ ok: true });
});

app.get("/count", async (req, res) => {
  const result = await pool.query("SELECT COUNT(*) FROM clicks");
  res.json({ count: Number(result.rows[0].count) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
