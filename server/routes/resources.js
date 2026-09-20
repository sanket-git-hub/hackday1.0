const express = require("express");
const { query } = require("../db");

const router = express.Router();

const FALLBACK = [
  {
    id: 1,
    title: "4-7-8 Breathing",
    category: "Breathing",
    content:
      "Inhale quietly through the nose for 4 counts, hold for 7, exhale through the mouth for 8. Repeat 3–4 cycles.",
    link: "https://www.healthline.com/health/4-7-8-breathing",
  },
  {
    id: 2,
    title: "Study stress reset",
    category: "Study",
    content:
      "When deadlines pile up: 5-minute walk, one glass of water, then return to a single 25-minute focus block.",
    link: null,
  },
  {
    id: 3,
    title: "Grounding: 5-4-3-2-1",
    category: "Grounding",
    content:
      "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Slow and deliberate.",
    link: null,
  },
  {
    id: 4,
    title: "Sleep hygiene basics",
    category: "Sleep",
    content:
      "Same bedtime most nights, screens off 30 min before, cool dark room. Consistency beats perfection.",
    link: null,
  },
];

router.get("/", async (_req, res) => {
  try {
    const result = await query(
      `SELECT id, title, category, content, link FROM resources ORDER BY id`,
    );
    res.json(result.rows.length ? result.rows : FALLBACK);
  } catch {
    res.json(FALLBACK);
  }
});

module.exports = router;
