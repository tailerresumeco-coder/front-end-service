import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login, OAuthGoogleSignup, getActiveResume, listMyResumes } from "../services/resumeService";
import ResumePickerModal from "./ResumePickerModal";

const Login = () => {
    const googleButtonRef = useRef(null); // Ref for the Google button
    
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Resume picker state
  const [showPicker, setShowPicker] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [checking, setChecking] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form);
      if (res.status === 200) {
        localStorage.setItem("access_token", res.data.access_token);
        await checkActiveResume();
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    }
  };

  const checkActiveResume = async () => {
    setChecking(true);
    try {
      const res = await getActiveResume();
      if (res.data.has_active) {
        navigate("/");
      } else {
        // No active resume — fetch list and show picker
        const listRes = await listMyResumes();
        setResumes(listRes.data.resumes || []);
        setShowPicker(true);
      }
    } catch (err) {
      // 401 is handled by axios interceptor (redirects to /login).
      // For any other error, show a message rather than silently failing.
      if (err.response?.status !== 401) {
        setError("Could not verify resume status. Please try again.");
      }
    } finally {
      setChecking(false);
    }
  };

  const handleResumeConfirmed = () => {
    setShowPicker(false);
    navigate("/");
  };

  const handleResumeSkipped = () => {
    setShowPicker(false);
    navigate("/");
  };

  const handleResumeUploaded = (newResume) => {
    setResumes((prev) => [newResume, ...prev]);
  };

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p>Login to continue tailoring your resume</p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-box">{error}</div>}

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              required
            />

            <button type="submit" disabled={checking}>
              {checking ? "Checking…" : "Login"}
            </button>
          </form>

          <p className="switch">
            Don't have an account?{" "}
            <span onClick={() => navigate("/sign-up")}>Sign up</span>
          </p>
                <div className="google-signup-wrapper" style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                    <div ref={googleButtonRef}></div>
                </div>
        </div>
      </div>

      {showPicker && (
        <ResumePickerModal
          resumes={resumes}
          onConfirm={handleResumeConfirmed}
          onSkip={handleResumeSkipped}
          onResumeUploaded={handleResumeUploaded}
        />
      )}
    </>
  );
};

export default Login;
