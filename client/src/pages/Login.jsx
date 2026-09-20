import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styles from "./Auth.module.css";
import CrisisBanner from "../components/CrisisBanner";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 async function handleSubmit(e) {
   e.preventDefault();
   setError("");
   setLoading(true);
   try {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
     });
     if (error) throw error;

     const role = data.user?.user_metadata?.role || "student";
     navigate(role === "counselor" ? "/counselor" : "/checkin");
   } catch (err) {
     setError(err.message || "Login failed");
   } finally {
     setLoading(false);
   }
 }
  return (
    <div className={styles.page}>
      <CrisisBanner />
      <div className={styles.split}>
        <Row className="g-0 h-100">
          <Col lg={6} className={styles.leftPanel}>
            <div className={styles.leftContent}>
              <p className={styles.grounding}>
                You don’t have to figure everything out alone.
              </p>
              <p className={styles.sub}>
                A quiet place to check in, find resources, or reach someone who
                can help.
              </p>
            </div>
          </Col>

          <Col lg={6} className={styles.rightPanel}>
            <div className={styles.formWrap}>
              <h1 className={styles.heading}>Sign in</h1>
              <p className={styles.lead}>
                Students and counselors use the same door.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@university.edu"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
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
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>

              <p className={styles.footer}>
                New here? <Link to="/signup">Create an account</Link>
              </p>
              <p className={styles.footerMuted}>
                Or continue anonymously →{" "}
                <Link to="/checkin">Quick check-in</Link>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
