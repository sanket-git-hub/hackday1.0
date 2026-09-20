require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const checkinRoutes = require("./routes/checkins");
const resourceRoutes = require("./routes/resources");
const bookingRoutes = require("./routes/bookings");
const counselorRoutes = require("./routes/counselor");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/checkins", checkinRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api", bookingRoutes);
app.use("/api/counselor", counselorRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
