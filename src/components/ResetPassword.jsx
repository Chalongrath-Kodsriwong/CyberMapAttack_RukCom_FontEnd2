/* Updated ResetPassword.jsx */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const resetToken = query.get("token");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Both fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/reset-password`,
        { token: resetToken, new_password: newPassword }
      );
      setMessage(response.data.msg);
      navigate("/"); // Direct navigation
    } catch (err) {
      setError(err.response?.data?.msg || "Error resetting password.");
    }
  };

  return (
    <div className="reset-password-container" style={{ display: "flex", flexDirection: "column" }}>
      <h2>Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <div className="container_input" style={{ marginLeft: "70px", display: "flex", flexDirection: "column" }}>
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
      </div>
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
}

export default ResetPassword;