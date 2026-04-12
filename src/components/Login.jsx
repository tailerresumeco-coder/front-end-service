import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login, OAuthGoogleSignup } from "../services/resumeService";

const Login = () => {
    const googleButtonRef = useRef(null); // Ref for the Google button
    
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            if (res.status === 200) {
                localStorage.setItem("access_token", res.data.access_token);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };


    const handleCallbackResponse = async (obj) => {
        const res = await OAuthGoogleSignup({ credential: obj.credential });
        if (res && res?.data?.access_token) {
            localStorage.setItem("access_token", res?.data?.access_token);
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


    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <p>Login to continue tailoring your resume</p>

                <form onSubmit={handleSubmit}>
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

                    <button type="submit">Login</button>
                </form>

                <p className="switch">
                    Don’t have an account? <span onClick={() => navigate("/sign-up")}>Sign up</span>
                </p>
                <div className="google-signup-wrapper" style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                    <div ref={googleButtonRef}></div>
                </div>
            </div>
        </div>
    );
};

export default Login;