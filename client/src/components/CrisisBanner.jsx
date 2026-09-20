import styles from "./CrisisBanner.module.css";

export default function CrisisBanner() {
  return (
    <aside
      className={styles.banner}
      role="complementary"
      aria-label="Crisis resources"
    >
      <div className={styles.inner}>
        <span className={styles.label}>If you need immediate help</span>
        <span className={styles.divider} aria-hidden="true" />
        <p className={styles.text}>
          Call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline) ·{" "}
          <a
            href="https://www.iasp.info/suicidalthoughts/"
            target="_blank"
            rel="noopener noreferrer"
          >
            International resources
          </a>
        </p>
      </div>
    </aside>
  );
}
