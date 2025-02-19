import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./css/Navbar.css";
import logo from "../../public/image.png";
import Count_Attack from "./Count_Attack";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState(""); // เก็บ Role ของผู้ใช้งาน
  const [sessionExpired, setSessionExpired] = useState(false); // ป้องกัน duplicate alerts
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("jwt_token");

  // ดึงข้อมูล userName และ userRole จาก API
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (token) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/get-user-info`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const data = response.data;
          setUserName(data.username || "User");
          setUserRole(data.role || "");
        } catch (error) {
          console.error("Error fetching user info:", error);
          setUserName("User");
          setUserRole("");
        }
      } else {
        setUserName("User");
        setUserRole("");
      }
    };

    fetchUserInfo();
  }, [token]);

  // ตรวจสอบ Token หมดอายุ
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && !sessionExpired) {
        try {
          const currentTime = Date.now() / 1000; // เวลาปัจจุบันในวินาที
          const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload

          if (decoded.exp < currentTime) {
            setSessionExpired(true); // ป้องกันการเรียกซ้ำ
            handleLogout();
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          setSessionExpired(true); // ป้องกันการเรียกซ้ำ
          handleLogout();
        }
      }
    }, 5000); // ตรวจสอบทุก ๆ 5 วินาที

    return () => clearInterval(interval); // ล้าง interval เมื่อ component ถูก unmount
  }, [token, sessionExpired]);

  const handleLogout = async () => {
    if (token) {
      try {
        await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error during logout API call:", error);
      }
    }
    localStorage.clear();
    setUserName("User");
    setUserRole("");
    navigate("/");
    setTimeout(() => {
      window.location.reload(); // Refresh หน้า
    }, 100);
  };

  const handleChangePassword = async () => {
    setError("");
    setSuccessMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/change-password-narbar`,
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage(response.data.msg || "Password updated successfully.");
      setShowChangePasswordPopup(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.response?.data?.msg || "Failed to change password.");
    }
  };

  return (
    <div className="navbar">
      {/* Logo Section */}
      <div className="navbar-logo">
        <a href="https://ruk-com.cloud/">
          <img src={logo} alt="Ruk-Com Logo" />
        </a>
      </div>

      {/* Middle Section */}
      <div className="middle_sec" style={{ display: "grid", gap: "5px", marginLeft: "80px" }}>
        <h1>Cyber Map Attacker</h1>
        <Count_Attack />
      </div>

      {/* Menu Section */}
      <div className="menu">
        <Link to="/main_page">Home</Link>
        <Link to="/Analytic">Analytic</Link>
        {userRole === "SuperAdmin" && <Link to="/management">User Management</Link>}

        {/* User Dropdown */}
        <div
          className={`user-dropdown ${!token ? "disabled" : ""}`}
          onClick={() => {
            if (token) setIsDropdownOpen(!isDropdownOpen);
          }}
        >
          <span className="user-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5H5.5z" />
            </svg>
          </span>
          <div className="wraper">
            {userName}
            <span className={`Arrow ${isDropdownOpen ? "rotate" : ""}`}>▼</span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {userRole !== "SuperAdmin" && (
                <button onClick={() => setShowChangePasswordPopup(true)}>
                  Change Password
                </button>
              )}
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Popup */}
      {showChangePasswordPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Change Password</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="popup-buttons">
              <button onClick={handleChangePassword}>Submit</button>
              <button onClick={() => setShowChangePasswordPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
