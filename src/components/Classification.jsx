import React, { useEffect, useState } from "react";
import "./css/Classification.css";
import axios from "axios";
import { setupClassificationAnimation } from "./JS/classification_Fun";


function Classification() {
  const [mitreCounts, setMitreCounts] = useState([]);
  const [showToday, setShowToday] = useState(true);

  const fetchMitreTechniques = async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      setMitreCounts(response.data);
    } catch (error) {
      console.error("Error fetching MITRE techniques data:", error);
    }
  };
  
  
  useEffect(() => {
    const endpoint = showToday
      ? `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/today_mitre_techniques`
      : `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/mitre_techniques`;
    fetchMitreTechniques(endpoint);

    const intervalId = setInterval(() => fetchMitreTechniques(endpoint), 5000);
    return () => clearInterval(intervalId);
  }, [showToday]);

  useEffect(() => {
    setupClassificationAnimation();
  }, []);

  return (
    <div>
      <div className="border">
        <p className="Classification" style={{ cursor: "pointer" }}>
          Classification{" "}
          <p
            className="btnOfSwitch"
            style={{ color: "grey", fontSize: "12px", cursor: "pointer"}}
            onClick={(e) => {
              e.stopPropagation(); // ป้องกันไม่ให้ event ส่งไปที่ .Classification
              setShowToday((prev) => !prev);
            }}
          >
            {showToday ? "Today" : "All"} &#10226;
          </p>
          <span className="Arrow1">▼</span>
        </p>
        <div className="container-item">
          {mitreCounts.map((item, index) => (
            <p
              key={index}
              className="items"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span className="key">{item.key}:</span>
              <span className="count">{item.doc_count.toLocaleString()}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Classification;
