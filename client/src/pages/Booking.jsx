import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Booking.module.css";
import CrisisBanner from "../components/CrisisBanner";

export default function Booking() {
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/counselor-slots")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setSlots(Array.isArray(data) ? data : []))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please sign in to book a slot.");
      return;
    }
    if (!selected) {
      setError("Please choose a time slot.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slot_id: selected, note: note || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Booking failed");
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <CrisisBanner />
        <main className={styles.main}>
          <div className={styles.inner}>
            <h1 className={styles.title}>Request sent</h1>
            <p className={styles.body}>
              A counselor will review your request and confirm the time.
            </p>
            <Link to="/checkin" className={styles.primary}>
              Return to check-in
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <CrisisBanner />
      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>Book a counselor</h1>
          <p className={styles.lead}>
            Choose an available time. Counselors will accept or decline.
          </p>

          {loading ? (
            <p className={styles.muted}>Loading available times…</p>
          ) : slots.length === 0 ? (
            <p className={styles.muted}>
              No open slots right now.{" "}
              <Link to="/resources">Browse resources</Link> instead.
            </p>
          ) : (
            <form onSubmit={handleSubmit}>
              <fieldset className={styles.slots}>
                <legend className={styles.legend}>Available times</legend>
                <div className={styles.slotGrid}>
                  {slots.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`${styles.slotBtn} ${selected === s.id ? styles.active : ""}`}
                      onClick={() => setSelected(s.id)}
                      disabled={!s.is_available}
                    >
                      {new Date(s.slot_time).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className={styles.field}>
                <label htmlFor="note">
                  Note <span className={styles.opt}>(optional)</span>
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything you’d like them to know."
                  maxLength={400}
                />
              </div>

              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className={styles.primary}
                disabled={submitting || !selected}
              >
                {submitting ? "Submitting…" : "Request this time"}
              </button>
            </form>
          )}

          <p className={styles.footer}>
            <Link to="/checkin">← Back to check-in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
