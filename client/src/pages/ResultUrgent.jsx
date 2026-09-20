import { Link } from "react-router-dom";
import styles from "./Result.module.css";
import CrisisBanner from "../components/CrisisBanner";

export default function ResultUrgent() {
  return (
    <div className={styles.page}>
      <CrisisBanner />
      <main className={styles.main}>
        <div className={styles.inner}>
          <p className={styles.badge} data-urgency="urgent">
            Urgent
          </p>
          <h1 className={styles.title}>Please reach out for support now</h1>
          <p className={styles.body}>
            Based on what you shared, it is important to connect with help right
            away. The resources below are available 24/7. If you are in
            immediate danger, call emergency services.
          </p>

          <div className={styles.crisisBox}>
            <h2 className={styles.crisisTitle}>Immediate help</h2>
            <ul className={styles.crisisList}>
              <li>
                <strong>988</strong> — Suicide &amp; Crisis Lifeline (US)
                <br />
                <span className={styles.meta}>Call or text · 24/7</span>
              </li>
              <li>
                <strong>Crisis Text Line</strong>
                <br />
                Text <strong>HOME</strong> to <strong>741741</strong>
              </li>
              <li>
                <a
                  href="https://www.iasp.info/suicidalthoughts/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  International Association for Suicide Prevention
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.actions}>
            <Link to="/booking" className={styles.primary}>
              Request a counselor callback
            </Link>
            <Link to="/resources" className={styles.secondary}>
              Self-help resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
