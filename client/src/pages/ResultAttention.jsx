import { Link } from "react-router-dom";
import styles from "./Result.module.css";
import CrisisBanner from "../components/CrisisBanner";

export default function ResultAttention() {
  return (
    <div className={styles.page}>
      <CrisisBanner />
      <main className={styles.main}>
        <div className={styles.inner}>
          <p className={styles.badge} data-urgency="attention">
            Needs attention
          </p>
          <h1 className={styles.title}>It might help to talk with someone</h1>
          <p className={styles.body}>
            Your check-in suggests this could be a good moment to connect with a
            counselor. You can also explore resources at your own pace.
          </p>
          <div className={styles.actions}>
            <Link to="/booking" className={styles.primary}>
              Book a counselor time
            </Link>
            <Link to="/resources" className={styles.secondary}>
              View self-help resources
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
