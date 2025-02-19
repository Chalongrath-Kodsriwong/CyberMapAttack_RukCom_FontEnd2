import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AcceptInvite = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("invite_token");

    if (inviteToken) {
      axios
        .get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/accept-invite?invite_token=${inviteToken}`
        )
        .then((response) => {
          console.log(response.data.msg);

          // เก็บ username ลงใน Local Storage
          if (response.data.username) {
            localStorage.setItem("username", response.data.username);
          }

          // พาผู้ใช้ไปที่หน้า Login หลังจากตอบรับคำเชิญ
          navigate("/");
        })
        .catch((error) => {
          console.error("Error accepting invite:", error);
        });
    }
  }, [navigate]);

  return <div>Processing your invitation...</div>;
};

export default AcceptInvite;
