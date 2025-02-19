import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import './App.css';
import Navbar from './components/Navbar';
import Login from "./components/Login.jsx";
import Analytic from './components/Analytic';
import Map from './components/Map.jsx';
import Classification from './components/Classification';
import Country_Attack from './components/Country_Attack';
import Data_Attack from './components/Data_Attack';
import ProtectedRoute from './components/ProtectedRoute';
import CreateUser from "./components/CreateUser.jsx";
import Management from "./components/Management"; 
import AcceptInvite from './components/AcceptInvite'; 
import ResetPassword from './components/ResetPassword'; 

function MainPage() {
  return (
    <div className="main_page">
      <div className="container">
        <div className="Map">
          <Map />
        </div>
        <div className="leftsize">
          <Country_Attack />
        </div>
        <div className="container_bottom">
          <div className="bottom_left">
            <Classification />
          </div>
          <div className="bottom_right">
            <Data_Attack />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          if (
            location.pathname !== "/" &&
            location.pathname !== "/createuser" &&
            location.pathname !== "/reset-password"
          ) {
            localStorage.removeItem("jwt_token");
            navigate("/"); 
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [location, navigate]);

  // Separate ResetPassword without Navbar and ProtectedRoute
  if (location.pathname === "/reset-password") {
    return (
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    );
  }

  useEffect(() => {
    const handleReload = () => {
      window.location.reload();
    };
  
    // ตั้งค่า listener สำหรับตรวจจับการเปลี่ยนเส้นทาง
    window.addEventListener('popstate', handleReload);
    window.addEventListener('pushstate', handleReload);
  
    return () => {
      window.removeEventListener('popstate', handleReload);
      window.removeEventListener('pushstate', handleReload);
    };
  }, []);
  

  return (
    <div className={`App ${location.pathname === "/" ? "main-lock" : ""}`}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<div className="Login"><Login /></div>}
        />
        <Route
          path="/createuser"
          element={<div className="createuser"><CreateUser /></div>}
        />
        <Route
          path="/main_page"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Analytic"
          element={
            <ProtectedRoute>
              <Analytic />
            </ProtectedRoute>
          }
        />
        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <Management />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accept-invite"
          element={<AcceptInvite />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;