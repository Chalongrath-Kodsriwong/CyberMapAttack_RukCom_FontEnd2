import React, { useEffect, useState } from "react";
import "./css/Data_attack.css";
import axios from "axios";
import { setupDataAttackerAnimation } from "./JS/data_attackerFun";

function Data_Attack() {
  const [attackers, setAttackers] = useState([]);
  const [descriptionColors, setDescriptionColors] = useState({});
  const [isColorLoaded, setIsColorLoaded] = useState(false);

  // โหลดข้อมูลสีจาก Database
  const fetchDescriptionColors = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/stored_rule_descriptions`
      );

      if (Array.isArray(response.data)) {
        const colorMap = response.data.reduce((acc, item) => {
          if (item.description && item.color) {
            acc[item.description] = item.color;
          }
          return acc;
        }, {});

        setDescriptionColors(colorMap);
        setIsColorLoaded(true);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching rule descriptions and colors:", error);
    }
  };

  const addHours = (timestamp, hours) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    date.setHours(date.getHours() + hours);
    return date.toISOString().replace("T", " ").replace("Z", "");
  };

  // โหลดข้อมูลการโจมตีหลังจากโหลดสีเสร็จแล้ว
  const fetchAttackers = async () => {
    if (!isColorLoaded) return;
    try {
      const [latestResponse, mitreResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/latest_alert`),
        axios.get(`${import.meta.env.VITE_REACT_APP_BASE_URL}/api/mitre_alert`),
      ]);

      const latestData = latestResponse.data || [];
      const mitreData = mitreResponse.data || [];

      setAttackers((prevAttackers) => {
        const updatedAttackers = [...latestData, ...mitreData, ...prevAttackers];
        return updatedAttackers.slice(0, 20);
      });
    } catch (error) {
      console.error("Error fetching updated attackers data:", error);
    }
  };

  useEffect(() => {
    fetchDescriptionColors();
  }, []);

  useEffect(() => {
    if (isColorLoaded) {
      fetchAttackers();
      const intervalId = setInterval(fetchAttackers, 500);
      return () => clearInterval(intervalId);
    }
  }, [isColorLoaded]);

  useEffect(() => {
    setupDataAttackerAnimation();
  }, []);

  return (
    <div className="On_container">
      <p className="DataAttacker_log">
        DATA ATTACKER<span className="Arrow2">▼</span>
      </p>
      <div className="tableContainer">
        <div className="table">
          <div className="header">
            <div className="fa timestamp">Timestamp</div>
            <div className="fa description">Attack Type</div>
            <div className="fa country_name">Attack Country</div>
            <div className="fa agent_ip">Attacker IP</div>
            <div className="fa country_name">Agent ID</div>
            <div className="fa target_server">Target Server</div>
          </div>
          <div className="data">
            {attackers.map((attacker, index) => {
              const source = attacker._source || {};
              const geoLocation = source.GeoLocation || {};
              const agent = source.agent || {};
              const agentIP = source.data || {};
              const rule = source.rule || {};
              const attackType = rule.description || "Unknown";

              return (
                <div key={index} className="row">
                  <div className="fa timestamp">
                    {addHours(source["@timestamp"], 7)}
                  </div>
                  <div
                    className="fa description"
                    style={{
                      color: descriptionColors[attackType] || "#FFFFFF",
                    }}
                  >
                    {attackType}
                  </div>
                  <div className="fa country_name">
                    {geoLocation.country_name || "N/A"}
                  </div>
                  <div className="fa agent_ip">{agentIP.srcip || "N/A"}</div>
                  <div className="fa agent_id">{agent.id || "N/A"}</div>
                  <div className="fa target_server">{agent.name || "N/A"}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Data_Attack;
