import { Link } from "react-router-dom";
import styles from "./Result.module.css";
import CrisisBanner from "../components/CrisisBanner";

export default function ResultRoutine() {
  return (
    <div className={styles.page}>
      <CrisisBanner />
      <main className={styles.main}>
        <div className={styles.inner}>
          <p className={styles.badge} data-urgency="routine">
            Routine
          </p>
          <h1 className={styles.title}>Thanks for checking in</h1>
          <p className={styles.body}>
            Your responses suggest things are manageable right now. Here are a
            few gentle resources you can use anytime.
          </p>
          <div className={styles.actions}>
            <Link to="/resources" className={styles.primary}>
              Browse self-help resources
            </Link>
            <Link to="/checkin" className={styles.secondary}>
              Do another check-in
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
