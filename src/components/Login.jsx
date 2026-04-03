import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { login } from "../services/resumeService";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(form);
            console.log(res);
            if (res.status === 200) {
                localStorage.setItem("access_token", res.data.access_token);
                navigate("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

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
            </div>
        </div>
    );
};

export default Login;