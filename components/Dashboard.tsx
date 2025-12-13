"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

type Summary = {
  total: number;
  normal: number;
  sweep: number;
};

type ChartRow = {
  time: string;
  ts: number;
  normal: number;
  sweep: number;
};

export default function Dashboard({ logs }: { logs: any[] }) {
  const [summary, setSummary] = useState<Summary>({
    total: 0,
    normal: 0,
    sweep: 0
  });

  const [chartData, setChartData] = useState<ChartRow[]>([]);

  function formatMinute(ts: string) {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return null;

    return (
      d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0") + " " +
      String(d.getHours()).padStart(2, "0") + ":" +
      String(d.getMinutes()).padStart(2, "0")
    );
  }

  useEffect(() => {
    if (!Array.isArray(logs) || logs.length === 0) {
      setSummary({ total: 0, normal: 0, sweep: 0 });
      setChartData([]);
      return;
    }

    const total = logs.length;
    const normal = logs.filter(l => l.label === "normal").length;
    const sweep = logs.filter(l => l.label === "ping_sweep").length;

    setSummary({ total, normal, sweep });

    const grouped: Record<string, ChartRow> = {};

    logs.forEach(l => {
      const time = formatMinute(l.timestamp);
      if (!time) return;

      const ts = new Date(l.timestamp).getTime();
      if (isNaN(ts)) return;

      if (!grouped[time]) {
        grouped[time] = {
          time,
          ts,
          normal: 0,
          sweep: 0
        };
      }

      if (l.label === "normal") grouped[time].normal++;
      if (l.label === "ping_sweep") grouped[time].sweep++;
    });

    const sorted = Object.values(grouped).sort(
      (a, b) => a.ts - b.ts
    );

    setChartData(sorted);
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

              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                minTickGap={40}
                tickFormatter={(t) => t.slice(11)} // แสดงแค่ HH:mm
              />

              <YAxis allowDecimals={false} />

              <Tooltip
                formatter={(v, name) => [
                  `${v} ครั้ง`,
                  name === "normal" ? "Normal" : "Ping Sweep"
                ]}
                labelFormatter={(l) => `เวลา ${l}`}
              />

              <Line
                type="monotone"
                dataKey="normal"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sweep"
                stroke="#dc2626"
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
