import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./CounselorDashboard.module.css";
import CrisisBanner from "../components/CrisisBanner";
import { useAuth } from "../context/AuthContext";

export default function CounselorDashboard() {
  const navigate = useNavigate();
  const {
    getAuthHeader,
    isCounselor,
    loading: authLoading,
    signOut,
  } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [tab, setTab] = useState("bookings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isCounselor) {
      navigate("/login");
      return;
    }

    Promise.all([
      fetch("/api/counselor/bookings", {
        headers: { ...getAuthHeader() },
      }).then((r) => (r.ok ? r.json() : [])),
      fetch("/api/counselor/flagged", {
        headers: { ...getAuthHeader() },
      }).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([b, f]) => {
        setBookings(Array.isArray(b) ? b : []);
        setFlagged(Array.isArray(f) ? f : []);
      })
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, [authLoading, isCounselor, getAuthHeader, navigate]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b)),
      );
    } catch {
      setError("Failed to update booking status.");
    }
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className={styles.page}>
      <CrisisBanner />
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Counselor dashboard</h1>
          <button
            type="button"
            className={styles.logout}
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={tab === "bookings" ? styles.tabActive : styles.tab}
            onClick={() => setTab("bookings")}
          >
            Bookings ({bookings.length})
          </button>
          <button
            type="button"
            className={tab === "flagged" ? styles.tabActive : styles.tab}
            onClick={() => setTab("flagged")}
          >
            Flagged check-ins ({flagged.length})
          </button>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {loading || authLoading ? (
          <p className={styles.muted}>Loading…</p>
        ) : tab === "bookings" ? (
          bookings.length === 0 ? (
            <p className={styles.muted}>No booking requests yet.</p>
          ) : (
            <ul className={styles.list}>
              {bookings.map((b) => (
                <li key={b.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={styles.status} data-status={b.status}>
                      {b.status}
                    </span>
                    <time>
                      {new Date(b.slot_time).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className={styles.meta}>
                    Student: {b.student_name || "Anonymous"}
                  </p>
                  {b.note && <p className={styles.note}>{b.note}</p>}
                  {b.status === "pending" && (
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.accept}
                        onClick={() => updateStatus(b.id, "accepted")}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className={styles.decline}
                        onClick={() => updateStatus(b.id, "declined")}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        ) : flagged.length === 0 ? (
          <p className={styles.muted}>No flagged urgent check-ins.</p>
        ) : (
          <ul className={styles.list}>
            {flagged.map((c) => (
              <li key={c.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.status} data-status="urgent">
                    urgent
                  </span>
                  <time>{new Date(c.created_at).toLocaleString()}</time>
                </div>
                <p className={styles.meta}>
                  Mood: {c.mood_score}/5 ·{" "}
                  {c.user_id ? "Identified" : "Anonymous"}
                </p>
                {c.free_text && <p className={styles.note}>{c.free_text}</p>}
              </li>
            ))}
          </ul>
        )}

        <p className={styles.footer}>
          <Link to="/checkin">Student check-in view</Link>
        </p>
      </main>
    </div>
  );
}
