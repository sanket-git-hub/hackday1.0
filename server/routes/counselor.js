const express = require("express");
const { query } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireRole("counselor"));

router.get("/bookings", async (req, res) => {
  try {
    const result = await query(
      `SELECT b.id, b.slot_time, b.status, b.note, b.created_at,
              u.name AS student_name
       FROM bookings b
       LEFT JOIN users u ON u.id = b.user_id
       WHERE b.counselor_id = $1
       ORDER BY b.created_at DESC`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

router.get("/flagged", async (_req, res) => {
  try {
    const result = await query(
      `SELECT c.id, c.mood_score, c.free_text, c.ai_urgency, c.created_at, c.user_id
       FROM checkins c
       WHERE c.ai_urgency = 'urgent'
       ORDER BY c.created_at DESC
       LIMIT 50`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

module.exports = router;
