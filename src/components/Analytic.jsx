import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import "../components/css/analytic.css";
import axios from "axios";
import { DateTime } from "luxon";

const Dashboard = () => {
  const [topIncidents, setTopIncidents] = useState([]);
  const [mitreTacticData, setMitreTacticData] = useState([{ data: [] }]);
  const [severityData, setSeverityData] = useState([]);
  const [endpointData, setEndpointData] = useState([]);
  const [incidentTimelineData, setIncidentTimelineData] = useState([]);
  const [realTimeData, setRealTimeData] = useState([{ name: "Real-Time", data: [] }]);
  // ค่าช่วงเวลาสำหรับกราฟ
  const [xaxisRange, setXaxisRange] = useState(getTodayRange());
  const [isUserPanning, setIsUserPanning] = useState(false);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const chartRef = useRef(null);
  const pendingDataRef = useRef([]); // ใช้เก็บข้อมูลใหม่หากผู้ใช้กำลังแพน


  // คำนวณช่วงเวลาของวันปัจจุบัน
  // const getTodayRange = () => ({
  //   min: DateTime.now().setZone("Asia/Bangkok").startOf("day").toMillis(), // เริ่มที่เที่ยงคืนของวันปัจจุบัน
  //   max: DateTime.now().setZone("Asia/Bangkok").endOf("day").toMillis(), // ไปจนถึง 23:59:59 ของวันเดียวกัน
  // });

  // คำนวณช่วงเวลาของวันปัจจุบัน
  function getTodayRange() {
    return {
      min: DateTime.now().setZone("Asia/Bangkok").startOf("day").toMillis(),
      max: DateTime.now().setZone("Asia/Bangkok").endOf("day").toMillis(),
    };
  }

  function getCurrentDate() {
    return DateTime.now().setZone("Asia/Bangkok").toFormat("dd MMM").toUpperCase(); // "11 FEB"
  }

  // ฟังก์ชัน Reset การซูมของกราฟ
  const handleResetZoom = () => {
    setXaxisRange(getTodayRange());
    setIsUserPanning(false);
  };


  // ฟังก์ชัน Reset กราฟ
  const resetChart = () => {
    const todayRange = getTodayRange();
    setXaxisRange(todayRange);

    if (chartRef.current) {
      chartRef.current.updateOptions({
        xaxis: { min: todayRange.min, max: todayRange.max },
      });
    }
  };
  

  // กำหนดค่า min/max เริ่มต้น
  // const [xaxisRange, setXaxisRange] = useState({
  //   min: DateTime.now().setZone("Asia/Bangkok").startOf("day").plus({ hours: 12 }).toMillis(),
  //   max: DateTime.now().setZone("Asia/Bangkok").startOf("day").plus({ hours: 36 }).toMillis(),
  // });

  // MITRE Tactic Chart Options
  const [mitreTacticOptions, setMitreTacticOptions] = useState({
    chart: { type: "bar" },
    colors: ["#03a9f4"],
    xaxis: { categories: [], labels: { style: { colors: "#fff" } } },
    yaxis: {
      labels: {
        style: { colors: "#fff" },
        formatter: (value) => {
          if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
          if (value >= 1000) return (value / 1000).toFixed(1) + "K";
          return value;
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"] },
    },
    plotOptions: {
      bar: { horizontal: true, columnWidth: "60%", endingShape: "rounded" },
    },
  });

  // Severity Pie Chart Options
  const [severityOptions, setSeverityOptions] = useState({
    chart: { type: "donut" },
    labels: [],
    colors: ["#e74c3c", "#f1c40f", "#3498db", "#2ecc71", "#9b59b6", "#f39c12"],
  });

  // Vulnerable Endpoints Chart Options
  const [endpointOptions, setEndpointOptions] = useState({
    chart: { type: "donut" },
    labels: [],
    colors: [
      "#00c6ff",
      "#17ead9",
      "#f7971e",
      "#ff7675",
      "#6c5ce7",
      "#e74c3c",
      "#3498db",
      "#2ecc71",
      "#f1c40f",
      "#9b59b6",
    ],
  });

  // Incident Timeline Chart Options
  const incidentTimelineOptions = {
    chart: {
      type: "line",
      animations: { enabled: true, dynamicAnimation: { speed: 1000 } },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: { type: "datetime", labels: { style: { colors: "#fff" } } },
    yaxis: { labels: { style: { colors: "#fff" } } },
    colors: ["#1abc9c", "#9b59b6", "#e74c3c", "#16a085", "#f39c12"],
  };

  // Real-Time Chart Options
  // ตั้งค่ากราฟและรองรับการซูม
  const realTimeChartOptions = {
    chart: {
      type: "line",
      animations: { enabled: true, easing: "linear", dynamicAnimation: { speed: 1000 } },
      zoom: { enabled: true, type: "x", autoScaleYaxis: true },
      toolbar: {
        autoSelected: "pan",
        show: true,
        tools: { reset: false },
      },
      events: {
        beforeZoom: (_, { xaxis }) => {
          setIsUserPanning(true);
          setXaxisRange({ min: xaxis.min, max: xaxis.max });
        },
        beforePan: (_, { xaxis }) => {
          setIsUserPanning(true);
          setXaxisRange({ min: xaxis.min, max: xaxis.max });
        },
        zoomed: () => setIsUserPanning(false),
        panned: () => setIsUserPanning(false),
      },
    },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      type: "datetime",
      min: xaxisRange.min,
      max: xaxisRange.max,
      tickAmount: 24,
      labels: {
        style: { colors: "#fff" },
        formatter: (val) => DateTime.fromMillis(val).setZone("Asia/Bangkok").toFormat("HH:mm"),
      },
      tooltip: {
        enabled: true,
        formatter: (val) => DateTime.fromMillis(val).setZone("Asia/Bangkok").toFormat("dd MMM HH:mm น."),
      },
    },
    yaxis: { labels: { style: { colors: "#fff" } } },
    markers: { size: 5, colors: ["#ff0000"], strokeWidth: 2, hover: { size: 6 } },
    colors: ["#2ecc71"],
  };
  
  
  

  // Reusable function to fetch data
  const fetchData = async (endpoint, callback) => {
    try {
      const response = await axios.get(endpoint);
      callback(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };

  // Fetch data for each chart
  
    const fetchTopIncidents = () => {
      const endpoint = `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/vulnerabilities`;
      fetchData(endpoint, (data) => {
        const formattedData = data.map((item) => ({
          severity: item.severity,
          description: `${item.count}`,
        }));
        setTopIncidents(formattedData);
      });
    };

    const fetchMitreTacticData = () => {
      const endpoint = `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/top-countries`;
      fetchData(endpoint, (data) => {
        const categories = data.map((item) => item.country);
        const seriesData = data.map((item) => item.count);
        setMitreTacticOptions((prev) => ({
          ...prev,
          xaxis: { ...prev.xaxis, categories },
        }));
        setMitreTacticData([{ data: seriesData }]);
      });
    };

    const fetchSeverityData = () => {
      const endpoint = `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/top-agents`;
      fetchData(endpoint, (data) => {
        const agentNames = data.map((item) => item.agent_name);
        const counts = data.map((item) => item.count);
        setSeverityOptions((prev) => ({ ...prev, labels: agentNames }));
        setSeverityData(counts);
      });
    };

    const fetchEndpointData = () => {
      const endpoint = `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/top-mitre-techniques`;
      fetchData(endpoint, (data) => {
        const labels = data.map((item) => item.technique);
        const seriesData = data.map((item) => item.count);
        setEndpointOptions((prev) => ({ ...prev, labels }));
        setEndpointData(seriesData);
      });
    };

    const fetchIncidentTimelineData = () => {
      const endpoint = `${
        import.meta.env.VITE_REACT_APP_BASE_URL
      }/api/top-techniques`;
      fetchData(endpoint, (data) => {
        const chartData = data.map((item) => ({
          name: item.technique,
          data: item.histogram.map((bucket) => ({
            x: new Date(bucket.timestamp).getTime(),
            y: bucket.count,
          })),
        }));
        setIncidentTimelineData(chartData);
      });
    };

    // const fetchRealTimeChartData = () => {
    //   const endpoint = `${
    //     import.meta.env.VITE_REACT_APP_BASE_URL
    //   }/api/peak-attack-periods`;
    //   fetchData(endpoint, (data) => {
    //     const formattedData = data.map((item) => ({
    //       x: new Date(item.timestamp).getTime(),
    //       y: item.count,
    //     }));
    //     setRealTimeData([{ name: "Real-Time", data: formattedData }]);
    //   });
    // };

    // ดึงข้อมูล Real-Time
  // ดึงข้อมูล Real-Time
  const fetchRealTimeData = async () => {
    try {
      const API_ENDPOINT = `${import.meta.env.VITE_REACT_APP_BASE_URL}/api/peak-attack-periods`;
      const response = await axios.get(API_ENDPOINT);
      const data = response.data;

      const formattedData = data.map((item) => ({
        x: DateTime.fromISO(item.timestamp, { zone: "Asia/Bangkok" }).toMillis(),
        y: item.count,
      })).filter((item) => item.y > 0 && !isNaN(item.y));

      // ถ้าผู้ใช้กำลังซูม ให้เก็บข้อมูลไว้ก่อน
      if (isUserPanning) {
        pendingDataRef.current = formattedData;
      } else {
        setRealTimeData([{ name: "Real-Time", data: formattedData }]);
        pendingDataRef.current = [];
      }
    } catch (error) {
      console.error("Error fetching real-time data:", error);
    }
  };
    
    
    

    
    

    useEffect(() => {

    // Fetch initial data
    fetchTopIncidents();
    fetchMitreTacticData();
    fetchSeverityData();
    fetchEndpointData();
    fetchIncidentTimelineData();
    // fetchRealTimeData();

    // Set intervals for real-time updates
    const intervals = [
      setInterval(fetchTopIncidents, 5000),
      setInterval(fetchMitreTacticData, 5000),
      setInterval(fetchSeverityData, 5000),
      setInterval(fetchEndpointData, 5000),
      setInterval(fetchIncidentTimelineData, 5000),
      // setInterval(fetchRealTimeData, 1000 * 60 * 60), // อัปเดตทุก 1 ชั่วโมง, // อัปเดตทุก 1 ชั่วโมง
    ];

    return () => intervals.forEach(clearInterval);
  }, [isUserPanning]);


   // ดึงข้อมูลทุกครั้งที่วันเปลี่ยน
   useEffect(() => {
    fetchRealTimeData(); // โหลดข้อมูลครั้งแรก
    const interval = setInterval(fetchRealTimeData, 1000 * 60); // อัปเดตทุก 1 นาที
    return () => clearInterval(interval);
  }, []);
  

  useEffect(() => {
    if (!isUserPanning && pendingDataRef.current.length > 0) {
      setRealTimeData([{ name: "Real-Time", data: pendingDataRef.current }]);
      pendingDataRef.current = [];
    }
  }, [isUserPanning]);
  
  
  
  


  // ตรวจจับว่าเมื่อถึงวันใหม่ให้รีเซ็ตช่วงเวลา
  useEffect(() => {
    const checkNewDay = setInterval(() => {
      const newDayStart = DateTime.now().setZone("Asia/Bangkok").startOf("day").toMillis();
      if (newDayStart !== xaxisRange.min) {
        setXaxisRange(getTodayRange());
        setRealTimeData([{ name: "Real-Time", data: [] }]); // รีเซ็ตข้อมูลเมื่อวันเปลี่ยน
        fetchRealTimeData(); // โหลดข้อมูลใหม่สำหรับวันใหม่
      }
    }, 1000 * 60); // ตรวจสอบทุก 1 นาที
  
    return () => clearInterval(checkNewDay);
  }, []);
  
  
  

  return (
    <div className="container-fluid">
      {/* Top Incidents Table */}
      <div className="p-3 grid-item-table">
        <h6>Vulnerability Detection</h6>
        <table className="table">
          <thead>
            <tr>
              <th style={{padding: "0px 25px"}}>Severity</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {topIncidents.map((incident, index) => (
              <tr key={index}>
                <td>
                  <span
                    className={`severity-label ${incident.severity.toLowerCase()}`}
                  >
                    {incident.severity}
                  </span>
                </td>
                <td>{incident.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alerts by MITRE Tactic */}
      <div className="p-3 grid-item-chart">
        <h6>Top 10 countries that attack the most (200day)</h6>
        <Chart
          options={mitreTacticOptions}
          series={mitreTacticData}
          type="bar"
          height={300}
        />
      </div>

      {/* Top 5 Agents */}
      <div className="p-3 grid-item-pie1">
        <h6>Top 5 agents (200day)</h6>
        <Chart
          options={severityOptions}
          series={severityData}
          type="donut"
          height={300}
        />
      </div>

      {/* Top 10 MITRE ATT&CKS */}
      <div className="p-3 grid-item-pie2">
        <h6>Top 10 MITRE ATT&CKS (200day)</h6>
        <Chart
          options={endpointOptions}
          series={endpointData}
          type="donut"
          height={300}
        />
      </div>

      {/* Incident Timeline Chart */}
      <div className="p-3 grid-item-full">
        <h6>The top MITRE techniques (7day)</h6>
        <Chart
          options={incidentTimelineOptions}
          series={incidentTimelineData}
          type="line"
          height={300}
        />
      </div>

      {/* Real-Time Chart */}
      <div className="p-3 grid-item-full">
        <h6>
          RECENT DAILY ATTACKS
          {/* ปุ่ม Reset */}
          <button onClick={handleResetZoom} style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold"
          }}>
            Reset
          </button>
        </h6>
        {/* แสดงวันที่ข้างบนกราฟ */}
        <span style={{
            marginLeft: "15px",
            padding: "5px 10px",
            background: "#30354E",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold"
          }}>
            {currentDate}
          </span>
        
        {/* กราฟ Real-Time */}
        <Chart ref={chartRef} options={realTimeChartOptions} series={realTimeData} type="line" height={300} />
      </div>
    </div>
  );
};

export default Dashboard;
