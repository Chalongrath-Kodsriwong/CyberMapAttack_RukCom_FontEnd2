import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwt_token");

  if (!token) {
      console.warn("No token found. Redirecting to login...");
      return <Navigate to="/" />;
  }

  try {
      const decoded = jwt_decode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      // ตรวจสอบ Token หมดอายุ
      if (decoded.exp < currentTime) {
          console.warn("Token expired. Redirecting to login...");
          localStorage.removeItem("jwt_token");
          return <Navigate to="/" />;
      }
  } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("jwt_token");
      return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;