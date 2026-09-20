CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('student', 'counselor')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS checkins (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  mood_score  SMALLINT NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  free_text   TEXT,
  ai_urgency  TEXT NOT NULL CHECK (ai_urgency IN ('routine', 'needs_attention', 'urgent')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS counselor_slots (
  id            SERIAL PRIMARY KEY,
  counselor_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slot_time     TIMESTAMPTZ NOT NULL,
  is_available  BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counselor_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slot_time     TIMESTAMPTZ NOT NULL,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'accepted', 'declined')),
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
  id        SERIAL PRIMARY KEY,
  title     TEXT NOT NULL,
  category  TEXT NOT NULL,
  content   TEXT NOT NULL,
  link      TEXT
);