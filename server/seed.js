require("dotenv").config();
const bcrypt = require("bcryptjs");
const { query, pool } = require("./db");

async function seed() {
  const hash = await bcrypt.hash("demo1234", 10);

  // Demo counselor
  const counselor = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Dr. Maya Chen', 'maya@counseling.edu', $1, 'counselor')
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [hash],
  );
  const counselorId = counselor.rows[0].id;

  // Demo student
  await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ('Alex Rivera', 'alex@student.edu', $1, 'student')
     ON CONFLICT (email) DO NOTHING`,
    [hash],
  );

  // Future slots
  const base = Date.now();
  for (let i = 1; i <= 6; i++) {
    const t = new Date(base + i * 86400000 + 10 * 3600000);
    await query(
      `INSERT INTO counselor_slots (counselor_id, slot_time, is_available)
       VALUES ($1, $2, true)`,
      [counselorId, t.toISOString()],
    );
  }

  // Resources
  const resources = [
    [
      "4-7-8 Breathing",
      "Breathing",
      "Inhale quietly through the nose for 4 counts, hold for 7, exhale through the mouth for 8. Repeat 3–4 cycles.",
      "https://www.healthline.com/health/4-7-8-breathing",
    ],
    [
      "Study stress reset",
      "Study",
      "When deadlines pile up: 5-minute walk, one glass of water, then return to a single 25-minute focus block.",
      null,
    ],
    [
      "Grounding: 5-4-3-2-1",
      "Grounding",
      "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Slow and deliberate.",
      null,
    ],
    [
      "Sleep hygiene basics",
      "Sleep",
      "Same bedtime most nights, screens off 30 min before, cool dark room. Consistency beats perfection.",
      null,
    ],
  ];

  for (const [title, category, content, link] of resources) {
    await query(
      `INSERT INTO resources (title, category, content, link)
       VALUES ($1, $2, $3, $4)`,
      [title, category, content, link],
    );
  }

  console.log("Seed complete.");
  console.log("Counselor → maya@counseling.edu / demo1234");
  console.log("Student   → alex@student.edu / demo1234");
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
