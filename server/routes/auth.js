const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../db");
const express = require("express");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role = "student" } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password required" });
    }
    if (!["student", "counselor"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hash, role],
    );
    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Email already registered" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await query(
      `SELECT id, name, email, password_hash, role FROM users WHERE email = $1`,
      [email],
    );
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/exchange", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Supabase token required" });
    }

    const supabaseToken = header.slice(7);

    // Verify Supabase JWT
    const payload = jwt.verify(supabaseToken, process.env.SUPABASE_JWT_SECRET);

    const supabaseId = payload.sub;
    const email = payload.email;
    const name = payload.user_metadata?.name || email.split("@")[0];
    const role = payload.user_metadata?.role || "student";

    // Upsert user into your local database
    const result = await query(
      `INSERT INTO users (name, email, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE
         SET name = EXCLUDED.name, role = EXCLUDED.role
       RETURNING id, name, email, role`,
      [name, email, role],
    );

    const user = result.rows[0];

    // Issue YOUR own JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ token, user });
  } catch (err) {
    console.error("Exchange error:", err.message);
    res.status(401).json({ message: "Invalid Supabase token" });
  }
});

module.exports = router;