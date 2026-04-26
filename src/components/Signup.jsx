import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { signup, OAuthGoogleSignup } from "../services/resumeService";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const googleButtonRef = useRef(null); // Ref for the Google button

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setError(""); // clear error while typing
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCallbackResponse = async (obj) => {
    const res = await OAuthGoogleSignup({credential: obj.credential});
    if (res && res?.data?.access_token) {
      localStorage.setItem("access_token", res?.data?.access_token);
      localStorage.setItem("email", res?.data?.user?.email);
      navigate("/");
    }
  };

  useEffect(() => {
    /* global google */
    // Initialize Google SDK
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "918373638000-sftdttmalfbclcnk8g9ss3fnk7pm8gg4.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });

      // Render the official button into our ref
      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "ams",
        text: "continue_with", // Displays "Sign up with Google"
        shape: "rectangular",
        width: "220", // Adjust to match your form width
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🧠 client-side validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await signup(form);

      // ✅ success
      navigate("/login");
    } catch (err) {
      console.log(err);

      // 🔥 backend error handling
      const message =
        err.response?.data?.detail || "Something went wrong";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Start building your ATS-ready resume</p>

        {/* 🔴 ERROR MESSAGE */}
        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create password"
              onChange={handleChange}
              required
            />
          </div>

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        <p className="switch">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>

        {/* 👁️ Toggle */}
        <p
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide Password" : "Show Password"}
        </p>
        <div className="google-signup-wrapper" style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <div ref={googleButtonRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;