"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer
} from "recharts";

export default function Dashboard({ logs }) {
  const [summary, setSummary] = useState({
    total: 0,
    normal: 0,
    sweep: 0
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!logs || logs.length === 0) return;

    const total = logs.length;
    const normal = logs.filter(l => l.label === "normal").length;
    const sweep = logs.filter(l => l.label === "ping_sweep").length;

    setSummary({ total, normal, sweep });

    const grouped = {};
    logs.forEach(l => {
      const t = l.timestamp.slice(0, 16);
      if (!grouped[t]) grouped[t] = { time: t, normal: 0, sweep: 0 };
      if (l.label === "normal") grouped[t].normal++;
      if (l.label === "ping_sweep") grouped[t].sweep++;
    });

    setChartData(Object.values(grouped));
  }, [logs]);

  return (
    <div className="border p-5 rounded space-y-5 bg-white shadow">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-gray-50">
          <p className="text-lg font-semibold">Total Logs</p>
          <p className="text-3xl">{summary.total}</p>
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <p className="text-lg font-semibold">Normal</p>
          <p className="text-3xl">{summary.normal}</p>
        </div>
        <div className="p-4 border rounded bg-gray-50">
          <p className="text-lg font-semibold">Ping Sweep</p>
          <p className="text-3xl text-red-600">{summary.sweep}</p>
        </div>
      </div>

      {/* Graph */}
      <div className="border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-3">Detection Graph</h3>

        <div className="w-full h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} minTickGap={40} />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="normal"
                stroke="#0084ff"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sweep"
                stroke="#ff0000"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
