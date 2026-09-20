const express = require("express");
const jwt = require("jsonwebtoken");
const { query } = require("../db");

const router = express.Router();

// Safe rule-based classifier (replace with real LLM later)
function classifyUrgency(moodScore, freeText) {
  const text = (freeText || "").toLowerCase();
  const crisis = [
    "suicide",
    "kill myself",
    "end it",
    "want to die",
    "self-harm",
    "hurt myself",
  ];
  if (crisis.some((k) => text.includes(k)) || moodScore === 1) return "urgent";
  if (
    moodScore <= 2 ||
    text.includes("anxious") ||
    text.includes("overwhelmed")
  ) {
    return "needs_attention";
  }
  return "routine";
}

function getUserId(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    return payload.id;
  } catch {
    return null;
  }
}

router.post("/", async (req, res) => {
  try {
    const { mood_score, free_text } = req.body;
    if (!mood_score || mood_score < 1 || mood_score > 5) {
      return res.status(400).json({ message: "mood_score must be 1–5" });
    }
    const userId = getUserId(req); // null = anonymous
    const urgency = classifyUrgency(mood_score, free_text);

    const result = await query(
      `INSERT INTO checkins (user_id, mood_score, free_text, ai_urgency)
       VALUES ($1, $2, $3, $4)
       RETURNING id, mood_score, ai_urgency, created_at`,
      [userId, mood_score, free_text || null, urgency],
    );
    res.status(201).json({
      id: result.rows[0].id,
      urgency: result.rows[0].ai_urgency,
      mood_score: result.rows[0].mood_score,
      created_at: result.rows[0].created_at,
    });
  } catch (err) {
    console.error(err);
    // Fallback so UI still works without DB
    const urgency = classifyUrgency(req.body.mood_score, req.body.free_text);
    res.status(201).json({
      id: Date.now(),
      urgency,
      mood_score: req.body.mood_score,
      created_at: new Date().toISOString(),
    });
  }
});

module.exports = router;
