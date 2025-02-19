import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import topojsonData from "../assets/110m.json"; // Import TopoJSON
import "./css/Map.css";
import axios from "axios";

const Map = () => {
  const mapRef = useRef();
  const [attackData, setAttackData] = useState([]);
  const [attackTypeColors, setAttackTypeColors] = useState({}); // เก็บสีจากฐานข้อมูล

  // Fixed Positions for Thailand and Singapore
  const fixedPositions = [
    {
      latitude: 13.736717,
      longitude: 100.523186,
      label: "TH",
      color: "#FFA500", // สีส้ม
    },
    {
      latitude: 1.29027,
      longitude: 103.851959,
      label: "SG",
      color: "#FF4500", // สีแดงส้ม
    },
  ];

  // Map Attack Type to Colors
  // const attackTypeColors = {
  //   "Web server 400 error code.": "#DCFFB7", // สีเหลือง
  //   "CMS (WordPress or Joomla) login attempt.": "#00DFA2", // สีเขียว
  //   "Botnet Activity Detected and Blocked": "#FF204E", // สีแดงเข้ม
  //   "High amount of POST requests in a small period of time (likely bot).":"#FF8D29", // สีส้ม
  //   "Multiple web server 400 error codes from same source ip.": "#F35588", // สีชมพู
  //   "WAF Alert: Request Blocked.": "#C2FFD9", // สีมิ้น
  //   "pure-ftpd: Multiple connection attempts from same source.": "#12CAD6", // สีฟ้าสดใส
  //   "pure-ftpd: FTP Authentication success.": "#0FABBC", // สีฟ้าสว่าง
  //   "Query cache denied (probably config error).": "#5628B4", // สีม่วงเข้ม
  //   "Simple shell.php command execution.": "#204969", // สีน้ำเงินเข้้ม
  //   "SQL injection attempt.": "#A4F6A5", // สีเขียวอ่อน
  //   "sshd Attempt to login using a non-existent user": "#FF0000", // สีแดง
  //   "Dovecot Authentication Success.": "#15F5BA", // สีเขียว
  //   "Common web attack.": "grey", // สีเขียว
  //   "URL too long. Higher than allowed on most browsers. Possible attack.":
  //     "#640D5F", // สีม่วง
  //   "Integrity checksum changed.": "#9ABF80", // สีเขียวขี้ม้า
  //   "XSS (Cross Site Scripting) attempt.": "#8D0B41", // สีแดงเลือดหมู
  //   "Suspicious Request Activity Detected": "#00DFA2", // สีแดงเลือดหมู
  //   "Nginx critical message.": "#FF8D29", // สีแดงเลือดหมู
  //   Unknown: "#FFFFFF", // Default สีขาว
  // };

  useEffect(() => {
    const width = 960;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .attr("viewBox", `0 40 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const countries = feature(topojsonData, topojsonData.objects.countries);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "#161D6F")
      .style("border-radius", "4px")
      .style("padding", "2px")
      .style("pointer-events", "none")
      .style("opacity", 0)
      .style("z-index", 22);

    svg
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#9AA6B2")
      .attr("stroke", "#176B87")
      .attr("stroke-width", 0.5)
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(`${d.properties.name}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`)
          .style("color", "#39B5E0");

        d3.select(this).attr("fill", "#84F2D6");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("fill", "#9AA6B2");
      });

    fixedPositions.forEach((position) => {
      const [fixedX, fixedY] = projection([
        position.longitude,
        position.latitude,
      ]);

      svg
        .append("circle")
        .attr("class", "marker-circle")
        .attr("cx", fixedX)
        .attr("cy", fixedY)
        .attr("r", 3.5)
        .style("z-index", "21")
        .attr("fill", position.color);

      const fontSize = 8;
      const textPadding = 6;
      const textWidth = position.label.length * fontSize;
      const textHeight = fontSize + textPadding;

      const bgRect = svg
        .append("rect")
        .attr("class", "bg_textLo")
        .attr("x", fixedX + 10)
        .attr("y", fixedY - textHeight / 2.5)
        .attr("width", textWidth + textPadding)
        .attr("height", textHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "#1D3557")
        .attr("opacity", 0.8)
        .style("cursor", "pointer");

      const textLabel = svg
        .append("text")
        .attr("class", "text_Lo")
        .attr("x", fixedX + 15)
        .attr("y", fixedY + 4)
        .attr("fill", "#50c3e9")
        .style("font-size", `${fontSize}px`)
        .style("font-family", "Arial, sans-serif")
        .text(position.label)
        .style("cursor", "pointer")
        .on("mouseenter", () => {
          textLabel.text(`RUKCOM Server ${position.label}`);
          bgRect.attr("width", 78 + 8);
        })
        .on("mouseleave", () => {
          textLabel.text(position.label);
          bgRect.attr("width", textWidth + textPadding);
        });
    });
  }, []);

  // ดึงข้อมูลสีจากฐานข้อมูล
  const fetchDescriptionColors = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/stored_rule_descriptions`,
        { headers }
      );

      if (Array.isArray(response.data)) {
        const colorMap = response.data.reduce((acc, item) => {
          if (item.description && item.color) {
            acc[item.description] = item.color;
          }
          return acc;
        }, {});

        setAttackTypeColors(colorMap);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching rule descriptions and colors:", error);
    }
  };

  useEffect(() => {
    fetchDescriptionColors(); // โหลดข้อมูลสีจาก Database
  }, []);

  // ดึงข้อมูลการโจมตีจาก API
  const fetchAttackData = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [latestResponse, mitreResponse] = await Promise.all([
        axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/latest_alert`,
          { headers }
        ),
        axios.get(
          `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/mitre_alert`,
          { headers }
        ),
      ]);

      const latestData = latestResponse.data || [];
      const mitreData = mitreResponse.data || [];
      const combinedData = [...latestData, ...mitreData];

      const filteredData = combinedData
        .map((item) => {
          const geoLocation = item._source?.GeoLocation || {};
          const agentName = item._source?.agent?.name || "";
          const attackType = item._source?.rule?.description || "Unknown";
          const target = agentName.startsWith("sg")
            ? fixedPositions[1]
            : fixedPositions[0];

          return {
            id: item._id,
            latitude: geoLocation.location?.lat,
            longitude: geoLocation.location?.lon,
            type: attackType,
            color: attackTypeColors[attackType] || "#FFFFFF", // ดึงสีจากฐานข้อมูล
            targetLatitude: target.latitude,
            targetLongitude: target.longitude,
          };
        })
        .filter((item) => item.latitude && item.longitude);

      setAttackData(filteredData);
    } catch (error) {
      console.error("Error fetching attack data:", error);
    }
  };

  useEffect(() => {
    if (Object.keys(attackTypeColors).length > 0) {
      fetchAttackData(); // โหลดข้อมูลเมื่อสีพร้อม
    }
  }, [attackTypeColors]);

  useEffect(() => {
    fetchAttackData();
    const intervalId = setInterval(fetchAttackData, 500);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const svg = d3.select(mapRef.current);
    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([960 / 2, 500 / 2]);

    const drawCannonballWithTrail = async (data) => {
      for (const attack of data) {
        const { longitude, latitude, type, targetLatitude, targetLongitude } =
          attack;
        if (!longitude || !latitude) continue;

        const [x, y] = projection([longitude, latitude]);
        const [targetX, targetY] = projection([
          targetLongitude,
          targetLatitude,
        ]);

        const attackColor = attackTypeColors[type] || "#FFFFFF";

        svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 0)
          .attr("fill", attackColor)
          .attr("opacity", 0.5)
          .transition()
          .duration(1000)
          .attr("r", 20)
          .attr("opacity", 0)
          .remove();

        const cannonball = svg
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 1.5)
          .attr("fill", attackColor)
          .style("filter", "url(#glow)");

        const midX = (x + targetX) / 2;
        const midY = (y + targetY) / 2 - 100;

        await new Promise((resolve) => {
          cannonball
            .transition()
            .duration(2000)
            .ease(d3.easeQuadInOut)
            .attrTween("transform", () => {
              return (t) => {
                const currentX =
                  (1 - t) * (1 - t) * x +
                  2 * (1 - t) * t * midX +
                  t * t * targetX;
                const currentY =
                  (1 - t) * (1 - t) * y +
                  2 * (1 - t) * t * midY +
                  t * t * targetY;

                svg
                  .append("line")
                  .attr("x1", currentX)
                  .attr("y1", currentY)
                  .attr("x2", currentX + 1)
                  .attr("y2", currentY + 1)
                  .attr("stroke", attackColor)
                  .attr("stroke-width", 0.5)
                  .transition()
                  .duration(200)
                  .style("opacity", 0)
                  .remove();

                return `translate(${currentX - x}, ${currentY - y})`;
              };
            })
            .on("end", () => {
              svg
                .append("circle")
                .attr("cx", targetX)
                .attr("cy", targetY)
                .attr("r", 0)
                .attr("fill", attackColor)
                .attr("opacity", 0.5)
                .transition()
                .duration(1000)
                .attr("r", 15)
                .attr("opacity", 0)
                .remove();

              cannonball.transition().duration(500).attr("r", 0).remove();
              resolve();
            });
        });

        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    };

    drawCannonballWithTrail(attackData);
  }, [attackData]);

  return <svg ref={mapRef} style={{backgroundColor: "#162344"}}></svg>;
};

export default Map;
