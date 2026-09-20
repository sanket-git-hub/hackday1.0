import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Resources.module.css";
import CrisisBanner from "../components/CrisisBanner";

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

export default function Resources() {
  const [resources, setResources] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setResources(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <CrisisBanner />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Self-help resources</h1>
          <p className={styles.lead}>
            Practical tools you can use on your own. No account needed.
          </p>
          <Link to="/checkin" className={styles.back}>
            ← Back to check-in
          </Link>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading…</p>
        ) : (
          <ul className={styles.list}>
            {resources.map((r) => (
              <li key={r.id} className={styles.card}>
                <span className={styles.category}>{r.category}</span>
                <h2 className={styles.cardTitle}>{r.title}</h2>
                <p className={styles.cardBody}>{r.content}</p>
                {r.link && (
                  <a
                    href={r.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.cardLink}
                  >
                    Learn more
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
