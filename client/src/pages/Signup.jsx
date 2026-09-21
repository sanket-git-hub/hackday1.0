import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import styles from "./Auth.module.css";
import CrisisBanner from "../components/CrisisBanner";
import { supabase } from "../lib/supabase";


async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role, // "student" or "counselor"
        },
      },
    });
    if (error) throw error;

    if (data.session) {
      // Email confirmation is disabled → session is returned immediately
      navigate(role === "counselor" ? "/counselor" : "/checkin");
    } else {
      setError("Check your email to confirm your account, then sign in.");
    }
  } catch (err) {
    setError(err.message || "Signup failed");
  } finally {
    setLoading(false);
  }
}
export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

//   
  return (
    <div className={styles.page}>
      <CrisisBanner />
      <div className={styles.split}>
        <Row className="g-0 h-100">
          <Col lg={6} className={styles.leftPanel}>
            <div className={styles.leftContent}>
              <p className={styles.grounding}>
                Start with a single step. That’s enough for today.
              </p>
              <p className={styles.sub}>
                Create an account only if you want. Check-ins work anonymously
                too.
              </p>
            </div>
          </Col>

          <Col lg={6} className={styles.rightPanel}>
            <div className={styles.formWrap}>
              <h1 className={styles.heading}>Create account</h1>
              <p className={styles.lead}>Choose the role that fits you.</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.field}>
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Alex Rivera"
                  />
                </div>

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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="At least 8 characters"
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="role">I am a</label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="student">Student</option>
                    <option value="counselor">Counselor</option>
                  </select>
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
                  {loading ? "Creating…" : "Create account"}
                </button>
              </form>

              <p className={styles.footer}>
                Already have an account? <Link to="/login">Sign in</Link>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
