import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/css/CreateUser.css";
import axios from "axios";

function CreateUser() {
  const [username, setUsername] = useState(""); // Added username field
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) =>{
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/register`,
        { username, email, password } // Send all fields
      );

      if (response.status === 201) {
        alert("User created successfully!");
        navigate("/"); // Redirect to login page
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="create-user-container">
      <div className="create-user-left">
        <h1>Welcome Back!</h1>
        <p>Enter your personal details to use all site features</p>
        <button className="create-user-signin-btn" onClick={() => navigate("/")}>
          SIGN IN
        </button>
        <button type="submit" className="btn-logingoole-register">
            <svg className="Icon-Google-registorpage" style={{
              height: "30px", width: "30px", background: "transparent", marginLeft: "3px"
            }} xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-brand-google"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" /></svg>
            <span className="text-google">Sign Up With Google</span>
          </button>
      </div>
      <div className="create-user-right">
        <h2>Create Account</h2>
        <form onSubmit={handleSignUp}>
          <div className="create-user-input-group">
            <input
              className="create-user-input-field"
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="create-user-input-group">
            <input
              className="create-user-input-field"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="create-user-input-group">
            <input
              className="create-user-input-field"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="create-user-error-message">{error}</p>}
          <button type="submit" className="create-user-signup-btn">
            SIGN UP
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
