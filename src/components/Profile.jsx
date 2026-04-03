import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch {
      localStorage.removeItem("access_token");
      navigate("/login");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div className="profile-page">

      {/* 🔥 HEADER */}
      <div className="profile-header">

        {/* ✅ Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

        <div className="profile-header-content">
          <div className="profile-avatar">
            {user?.sub?.charAt(0).toUpperCase()}
          </div>

          <div className="profile-details">
            <h2>{user?.sub?.split("@")[0]}</h2>
            <p>{user?.sub}</p>
          </div>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="profile-stats">
        <div className="stat-box">
          <h3>12</h3>
          <p>Resumes</p>
        </div>

        <div className="stat-box">
          <h3>8</h3>
          <p>ATS Checked</p>
        </div>

        <div className="stat-box">
          <h3>3</h3>
          <p>Tailored</p>
        </div>
      </div>

      {/* 📄 CONTENT */}
      <div className="profile-content">
        <h3>Your Activity</h3>

        <div className="activity-card">
          <p>Uploaded Resume - Software Engineer</p>
        </div>

        <div className="activity-card">
          <p>Checked ATS Score - Backend Role</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;