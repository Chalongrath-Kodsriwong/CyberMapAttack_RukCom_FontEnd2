import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      axios
        .get(`http://localhost:5000/verify-email?token=${token}`)
        .then((response) => {
          setMessage("Email verified successfully! You can now log in.");
          setTimeout(() => {
            navigate("/"); // Redirect to login after success
          }, 3000); // Redirect after 3 seconds
        })
        .catch((error) => {
          if (error.response && error.response.status === 400) {
            setMessage("Invalid or expired token. Redirecting to login...");
            setTimeout(() => {
              navigate("/"); // Redirect to login after failure
            }, 3000); // Redirect after 3 seconds
          } else {
            setMessage("An unexpected error occurred. Please try again.");
          }
        });
    } else {
      setMessage("Token is missing. Redirecting to login...");
      setTimeout(() => {
        navigate("/"); // Redirect to login if no token
      }, 3000); // Redirect after 3 seconds
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default VerifyEmail;
