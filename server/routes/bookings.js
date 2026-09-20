const express = require("express");
const { query } = require("../db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// GET available counselor slots
router.get("/counselor-slots", async (_req, res) => {
  try {
    const result = await query(
      `SELECT cs.id, cs.slot_time, cs.is_available
       FROM counselor_slots cs
       WHERE cs.is_available = true AND cs.slot_time > NOW()
       ORDER BY cs.slot_time
       LIMIT 30`,
    );
    res.json(result.rows);
  } catch {
    // Demo fallback slots
    const now = Date.now();
    res.json([
      {
        id: 1,
        slot_time: new Date(now + 86400000).toISOString(),
        is_available: true,
      },
      {
        id: 2,
        slot_time: new Date(now + 172800000).toISOString(),
        is_available: true,
      },
      {
        id: 3,
        slot_time: new Date(now + 259200000).toISOString(),
        is_available: true,
      },
    ]);
  }
});

// POST booking request
router.post("/bookings", requireAuth, async (req, res) => {
  try {
    const { slot_id, note } = req.body;
    if (!slot_id) return res.status(400).json({ message: "slot_id required" });

    const slotRes = await query(
      `SELECT id, counselor_id, slot_time, is_available FROM counselor_slots WHERE id = $1`,
      [slot_id],
    );
    const slot = slotRes.rows[0];
    if (!slot || !slot.is_available) {
      return res.status(400).json({ message: "Slot unavailable" });
    }

    const result = await query(
      `INSERT INTO bookings (user_id, counselor_id, slot_time, status, note)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING id, status, slot_time, note, created_at`,
      [req.user.id, slot.counselor_id, slot.slot_time, note || null],
    );

    await query(
      `UPDATE counselor_slots SET is_available = false WHERE id = $1`,
      [slot_id],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH status (counselor only)
router.patch(
  "/bookings/:id/status",
  requireAuth,
  requireRole("counselor"),
  async (req, res) => {
    try {
      const { status } = req.body;
      if (!["accepted", "declined"].includes(status)) {
        return res
          .status(400)
          .json({ message: "status must be accepted or declined" });
      }
      const result = await query(
        `UPDATE bookings SET status = $1 WHERE id = $2 AND counselor_id = $3
       RETURNING id, status, slot_time, note`,
        [status, req.params.id, req.user.id],
      );
      if (!result.rows[0])
        return res.status(404).json({ message: "Booking not found" });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
);

module.exports = router;
