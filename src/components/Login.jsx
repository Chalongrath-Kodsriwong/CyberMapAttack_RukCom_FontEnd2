import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../components/css/Login.css";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // For Forgot Password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false); // Pop-up state
  const [step, setStep] = useState(1); // Step 1: Username/Password, Step 2: OTP, Step 3: QR Code
  const [otp, setOtp] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loginError, setLoginError] = useState(""); // Error สำหรับ Login
  const [forgotPasswordError, setForgotPasswordError] = useState(""); // Error สำหรับ Forgot Password

  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const inviteToken = query.get("invite_token");
  const [otpError, setOtpError] = useState(""); // ข้อความ Error หาก OTP ไม่ถูกต้อง

  const openOtpModal = () => setIsOtpModalOpen(true); // เปิด PopUp
  const closeOtpModal = () => {
    setIsOtpModalOpen(false); // ปิด PopUp
    setOtp(""); // ล้างข้อมูล OTP
    setOtpError(""); // ล้างข้อความ Error
  };

  useEffect(() => {
    const handleInviteToken = async () => {
      if (inviteToken) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_REACT_APP_BASE_URL
            }/api/accept-invite?token=${inviteToken}`
          );
          setMessage(response.data.msg);
        } catch (err) {
          setError(
            err.response?.data?.msg || "Invalid or expired invitation link."
          );
        }
      }
    };

    handleInviteToken();
  }, [inviteToken]);

  const handleForgotPassword = async () => {
    setForgotPasswordError(""); // Reset error สำหรับ Forgot Password
    setMessage("");

    if (!email) {
      setForgotPasswordError("Please enter your email.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/forgot-password`,
        { email }
      );
      setMessage(response.data.msg || "Password reset email sent.");
      setShowForgotPasswordPopup(false); // Close popup
    } catch (err) {
      setForgotPasswordError(
        err.response?.data?.msg || "Error sending password reset email."
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); // Reset error สำหรับ Login

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/login`,
        { username, password }
      );

      if (response.data.setup_2fa) {
        // หากยังไม่ได้ตั้งค่า 2FA ให้บันทึก username และ role ลงใน Local Storage
        const { username, role } = response.data;
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);

        // สร้าง QR Code
        const qrResponse = await axios.post(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/setup-2fa`,
          { username }
        );
        setQrCodeUrl(qrResponse.data.otpauth_url);
        setStep(2); // Show QR code step
      } else {
        // บันทึกข้อมูลลงใน Local Storage
        const { access_token, role } = response.data;
        localStorage.setItem("jwt_token", access_token);
        localStorage.setItem("username", username); // เพิ่ม username
        localStorage.setItem("role", role);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        setStep(3); // Show OTP input step
      }
    } catch (err) {
      setLoginError(err.response?.data?.msg || "Login failed");
    }
  };

  const handleOtpValidation = async () => {
    setOtpError(""); // Reset error message
    try {
      const usernameFromStorage = localStorage.getItem("username"); // ดึง username จาก Local Storage
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/validate-otp`,
        { username: usernameFromStorage, otp }
      );

      if (response.data.error) {
        // หาก OTP ไม่ถูกต้อง
        setOtpError("OTP Incorrect!");
      } else if (response.status === 200) {
        const { access_token } = response.data;

        // เก็บ Token ที่ได้ใหม่
        localStorage.setItem("jwt_token", access_token);

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;

        // นำทางไปยังหน้าหลัก
        navigate("/main_page");
      }
    } catch (err) {
      // แสดงข้อความ Error หากเซิร์ฟเวอร์มีปัญหา
      setOtpError(err.response?.data?.msg || "Invalid OTP");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2 style={{ fontWeight: "200" }}>
          {step === 1 ? "Login" : step === 3 ? "Verify OTP" : "Scan QR Code"}
        </h2>
        <div className="error-container">
          {loginError && <p className="error-message active">{loginError}</p>}
        </div>
        {/* <div className="success-container">
      {message && <p className="success-message">{message}</p>}
    </div> */}
        {step === 1 && (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="input-wrapper">
                <FaUser className="icon" />
                <input
                  className="input-field"
                  placeholder="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="input-group">
              <div className="input-wrapper">
                <FaLock className="icon" />
                <input
                  className="input-field"
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div
              className="forgotpassword"
              style={{
                marginLeft: "-55px",
                color: "black",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => setShowForgotPasswordPopup(true)}
            >
              <p className="forgotpassword">Forgot Password?</p>
            </div>

            <button type="submit" className="btn-login">
              Login
            </button>
          </form>
        )}

        {step === 2 && (
          <div>
            <div className="wrapperQRCode" style={{marginLeft: "100px", marginBottom: "20px"}}>
            {/* <h3>Scan QR Code</h3> */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
                qrCodeUrl
              )}&size=200x200`}
              alt="QR Code"
            />

            </div>
            <p>Scan this QR code with your Google Authenticator app.</p>
            <button onClick={() => setStep(3)} className="btn-login">
              Continue to OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
              flexDirection: "column",
            }}
          >
            <p
              style={{
                color: "red",
                margin: "-20px 10px 20px 10px",
                minHeight: "20px", // จองความสูงของข้อความ
                visibility: otpError ? "visible" : "hidden", // ซ่อนข้อความหากไม่มี Error
              }}
            >
              {otpError}
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{
                padding: "10px",
                borderRadius: "15px",
                textAlign: "center",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleOtpValidation(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                }
              }}
            />
            <button onClick={handleOtpValidation} className="btn-login">
              Verify OTP
            </button>
          </div>
        )}
      </div>
      {/* เงื่อนไขสำหรับ login-right */}
      {step === 1 && (
        <div className="login-right">
          <div className="text">
            <h2>Welcome to</h2>
            <h2 className="Text_line2">Cyber Map Attack</h2>
          </div>
          <div className="img">
            <img src="RE02-PNG.png" alt="" />
          </div>
        </div>
      )}

      {/* Forgot Password Pop-up */}
      {showForgotPasswordPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 style={{ color: "#fff" }}>Reset Password</h2>
            <div className="error-container">
              {forgotPasswordError && (
                <p className="error-message active">{forgotPasswordError}</p>
              )}
            </div>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="change_email"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleForgotPassword(); // กด Enter เพื่อเรียกใช้ฟังก์ชัน Confirm
                }
              }}
            />
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                className="btn_reset_email"
                onClick={handleForgotPassword}
              >
                Send Reset Email
              </button>
              <button
                className="btn_cancel_email"
                onClick={() => setShowForgotPasswordPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
