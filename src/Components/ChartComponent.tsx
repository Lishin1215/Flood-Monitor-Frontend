import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./ChartComponent.css";
import * as Sentry from "@sentry/react";

interface WaterLevelReading {
  dateTime: string;
  value: number;
}

interface ChartProps {
  notation: string;
}

const ChartComponent: React.FC<ChartProps> = ({ notation }) => {
  const [data, setData] = useState<WaterLevelReading[]>([]);
  const [hasData, setHasData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartDate, setChartDate] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:5000/get-particular-M/${notation}`)
      .then((res) => {
        if (res.data.hasData && Array.isArray(res.data.readings) && res.data.readings.length > 0) {
            const formattedData = res.data.readings
            .filter((item: any) => item.dateTime && item.value !== null)
            .map((item: any) => ({
              dateTime: item.dateTime,
              timeLabel: new Date(item.dateTime).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              }),
              value: parseFloat(item.value),
            }))
            .sort((a: { dateTime: string | number | Date; }, b: { dateTime: string | number | Date; }) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()); // 🔥 按時間排序
          
            
          const now = new Date();
          const nowTimeLabel = now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          });
          
          formattedData.push({
            dateTime: now.toISOString(),
            timeLabel: nowTimeLabel,
            value: null,
          });

          const firstDate = new Date(formattedData[formattedData.length - 1].dateTime).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
          

          setData(formattedData);
          setChartDate(firstDate);
          setHasData(formattedData.length > 0);
        } else {
          setData([]);
          setHasData(false);
        }
      })
      .catch((err) => {
        Sentry.captureException(err);
        console.error("Error fetching readings:", err);
        setHasData(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [notation]);

  if (loading) {
    return (
      <div className="chart-container">
        {/* <h2 className="chart-title">Data for {notation}</h2> */}
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  if (!hasData || data.length === 0) {
    return (
      <div className="chart-container">
        {/* <h2 className="chart-title">Data for {notation}</h2> */}
        <p className="text-gray-500">No chart data available.</p>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h2 className="chart-title">
        Data for the past 24 hours ({chartDate})
      </h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={600}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 50, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" angle={-30} textAnchor="end" />
            <YAxis
            label={{
                value: "Water Level (m³/s)",
                angle: -90,
                position: "outsideLeft", 
                dy: 10,
                dx: -50,
                style: { fontSize: "14px", fontWeight: "bold" } 
            }}
            tick={{ fontSize: 12 }} 
            tickMargin={10} 
            />

            <Tooltip formatter={(value) => [`${value} m³/s`, "Water Level"]} />
            <Line type="monotone" dataKey="value" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;
