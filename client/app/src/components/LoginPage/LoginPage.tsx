import styles from "./Login.module.css";
import { isLogin, reCheck } from "../Authorization/Authorization";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const isLoggedIn = useContext(isLogin);
  const context = useContext(reCheck);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!context || !context.setCheck) {return;}
  const { check, setCheck } = context;

  useEffect(() => {
    if (check) setCheck(false);
    else setCheck(true);
  }, []);

  if (isLoggedIn == 1) navigate("/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = `http://${import.meta.env.VITE_DOMAIN}:8000/api/auth/${isSignup ? 'signup' : 'login'}`;
      const data = isSignup 
        ? { email, password, username }
        : { email, password };

      const response = await axios.post(endpoint, data, {
        withCredentials: true
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (response.data.requiresTwoFa) {
            navigate("/two-factor");
          } else {
            setCheck(!check);
            navigate("/");
          }
        }, 800);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.loginBox} ${success ? styles.success : ''}`}>
      <div className={styles.iconWrapper}>
        <i className={`fa-solid ${isSignup ? 'fa-user-plus' : 'fa-lock'} ${styles.mainIcon}`}></i>
      </div>
      
      <h1>{isSignup ? "Create Account" : "Welcome Back"}</h1>
      <h2>{isSignup ? "Join us today" : "Login to continue"}</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {isSignup && (
          <div className={styles.inputWrapper}>
            <i className="fa-solid fa-user"></i>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
            />
          </div>
        )}
        
        <div className={styles.inputWrapper}>
          <i className="fa-solid fa-envelope"></i>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
            disabled={loading}
          />
        </div>
        
        <div className={styles.inputWrapper}>
          <i className="fa-solid fa-lock"></i>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            disabled={loading}
          />
          <i 
            className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} ${styles.eyeIcon}`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
        </div>

        {error && (
          <div className={styles.errorWrapper}>
            <i className="fa-solid fa-circle-exclamation"></i>
            <p className={styles.error}>{error}</p>
          </div>
        )}

        {success && (
          <div className={styles.successWrapper}>
            <i className="fa-solid fa-circle-check"></i>
            <p className={styles.successMsg}>Success! Redirecting...</p>
          </div>
        )}

        <button 
          type="submit" 
          className={`${styles.button} ${loading ? styles.loading : ''}`}
          disabled={loading || success}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i>
              <span>Processing...</span>
            </>
          ) : success ? (
            <>
              <i className="fa-solid fa-check"></i>
              <span>Success!</span>
            </>
          ) : (
            <span>{isSignup ? "Create Account" : "Login"}</span>
          )}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <p className={styles.toggle}>
        {isSignup ? "Already have an account? " : "Don't have an account? "}
        <span onClick={() => {
          if (!loading && !success) {
            setIsSignup(!isSignup);
            setError("");
            setEmail("");
            setPassword("");
            setUsername("");
          }
        }}>
          {isSignup ? "Login here" : "Sign up here"}
        </span>
      </p>
    </div>
  );
};

export default LoginPage;
