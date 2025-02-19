import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Countattack.css";
import { setupCountAttackAnimation } from "./JS/Count_Attack_Fun";

function Count_Attack() {
  const [todayAttacks, setTodayAttacks] = useState(0); // จำนวนการโจมตีวันนี้ทั้งหมด
  const [totalAttacks, setTotalAttacks] = useState(0); // จำนวนการโจมตีทั้งหมด

  // ฟังก์ชันดึงข้อมูลการโจมตีของวันนี้ทั้งหมด
  const fetchTodayAttacks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/today-attacks`
      );
      const totalToday = response.data.reduce((sum, item) => sum + item.count, 0);
      setTodayAttacks(totalToday);
    } catch (error) {
      console.error("Error fetching today's attacks:", error);
    }
  };

  // ฟังก์ชันดึงข้อมูลการโจมตีทั้งหมด
  const fetchTotalAttacks = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/top-countries`
      );
      const total = response.data.reduce((sum, item) => sum + item.count, 0); // รวมจำนวนการโจมตีทั้งหมด
      setTotalAttacks(total);
    } catch (error) {
      console.error("Error fetching total attacks:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (localStorage.getItem("jwt_token")) {
        fetchTodayAttacks();
        fetchTotalAttacks();
      } else {
        setTodayAttacks(0); // รีเซ็ตเป็น 0 เมื่อไม่มี Token
        setTotalAttacks(0); // รีเซ็ตเป็น 0 เมื่อไม่มี Token
      }
    }, 5000); // เรียกทุก 5 วินาที

    // เรียก fetch ข้อมูลทันทีเมื่อโหลด component
    fetchTodayAttacks();
    fetchTotalAttacks();

    return () => clearInterval(intervalId); // ล้าง interval เมื่อ component ถูก unmount
  }, []);

  useEffect(() => {
    setupCountAttackAnimation();
  }, []);

  return (
    <div className="wraper">
      <p>
        <strong className="Textes">Total Attacks Today:</strong>
        <span className="result">{todayAttacks}</span>
      </p>
    </div>
  );
}

export default Count_Attack;
