import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./CheckIn.module.css";
import CrisisBanner from "../components/CrisisBanner";

const MOOD_LABELS = {
  1: "Very low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export default function CheckIn() {
  const navigate = useNavigate();
  const [mood, setMood] = useState(null);
  const [freeText, setFreeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!mood) {
      setError("Please choose a mood score.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ mood_score: mood, free_text: freeText || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Check-in failed");
      }
      const data = await res.json();
      if (data.urgency === "urgent") {
        navigate("/result/urgent", { state: { checkin: data } });
      } else if (data.urgency === "needs_attention") {
        navigate("/result/attention", { state: { checkin: data } });
      } else {
        navigate("/result/routine", { state: { checkin: data } });
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <CrisisBanner />
      <main className={styles.main}>
        <div className={styles.inner}>
          <h1 className={styles.title}>How are you feeling right now?</h1>
          <p className={styles.lead}>
            One quick check-in. No account required.
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset className={styles.moodScale}>
              <legend className={styles.legend}>Mood (1–5)</legend>
              <div className={styles.scaleRow}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`${styles.moodBtn} ${mood === n ? styles.active : ""}`}
                    onClick={() => setMood(n)}
                    aria-pressed={mood === n}
                    aria-label={`${n}: ${MOOD_LABELS[n]}`}
                  >
                    <span className={styles.num}>{n}</span>
                    <span className={styles.label}>{MOOD_LABELS[n]}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className={styles.field}>
              <label htmlFor="freetext">
                Anything else?{" "}
                <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="freetext"
                rows={3}
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="A few words is fine. Or leave blank."
                maxLength={500}
              />
            </div>

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading || !mood}
            >
              {loading ? "Checking in…" : "Submit check-in"}
            </button>
          </form>

          <p className={styles.note}>
            Already have an account? <Link to="/login">Sign in</Link> to save
            history and book counselors.
          </p>
        </div>
      </main>
    </div>
  );
}
