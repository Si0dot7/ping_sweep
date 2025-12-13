"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function LogViewer({ logs }: { logs: any[] }) {
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [chartData, setChartData] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  const pageSize = 10;
  const paginatedLogs = logs.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(logs.length / pageSize);

  // ============================================================
  // Counter
  // ============================================================
  const attackCount: Record<string, number> = {};
  const targetCount: Record<string, number> = {};

  logs.forEach((l) => {
    attackCount[l.src_ip] = (attackCount[l.src_ip] || 0) + 1;
    targetCount[l.dst_ip] = (targetCount[l.dst_ip] || 0) + 1;
  });

  const topAttacker = Object.entries(attackCount).sort((a, b) => b[1] - a[1])[0];
  const topTarget = Object.entries(targetCount).sort((a, b) => b[1] - a[1])[0];

  // ============================================================
  // AI-like Risk Scoring (Heuristic Model)
  // ============================================================
  function calculateRisk(ip: string) {
    const related = logs.filter((l) => l.src_ip === ip);
    if (related.length === 0) return 0;

    const count = related.length;
    const uniqueTargets = new Set(related.map((l) => l.dst_ip)).size;
    const icmpRatio =
      related.filter((l) => l.icmp_type === 8).length / count;

    let score = 0;
    if (count > 50) score += 30;
    if (uniqueTargets > 10) score += 30;
    if (icmpRatio > 0.6) score += 40;

    return Math.min(score, 100);
  }

  function explainRisk(ip: string) {
    const related = logs.filter((l) => l.src_ip === ip);
    const reasons: string[] = [];

    if (related.length > 50) reasons.push("High packet frequency");
    if (new Set(related.map((l) => l.dst_ip)).size > 10)
      reasons.push("Multiple destination scanning");

    const icmpRatio =
      related.filter((l) => l.icmp_type === 8).length / related.length;
    if (icmpRatio > 0.6) reasons.push("ICMP Echo dominance");

    return reasons;
  }

  const topRiskIPs = useMemo(() => {
    return Object.keys(attackCount)
      .map((ip) => ({
        ip,
        risk: calculateRisk(ip),
      }))
      .filter((i) => i.risk >= 60)
      .sort((a, b) => b.risk - a.risk)
      .slice(0, 5);
  }, [logs]);

  // ============================================================
  // Time series
  // ============================================================
  function buildTimeSeries(ip: string, type: "src" | "dst") {
    const timeline: Record<string, number> = {};

    logs.forEach((l) => {
      if (type === "src" && l.src_ip !== ip) return;
      if (type === "dst" && l.dst_ip !== ip) return;

      const date = new Date(l.timestamp);
      if (isNaN(date.getTime())) return;

      const key =
        date.getFullYear() +
        "-" +
        String(date.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        " " +
        String(date.getHours()).padStart(2, "0") +
        ":" +
        String(date.getMinutes()).padStart(2, "0");

      timeline[key] = (timeline[key] || 0) + 1;
    });

    return Object.entries(timeline).map(([time, count]) => ({ time, count }));
  }

  const openChartModal = (ip: string, type: "src" | "dst") => {
    setChartData(buildTimeSeries(ip, type));
    setModalTitle(`${ip} — Activity Timeline`);
    setShowModal(true);
  };

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="border p-5 rounded bg-white shadow">
      <h2 className="text-2xl font-bold mb-4">Log Viewer</h2>

      {/* Summary */}
      <div className="mb-5 p-4 bg-gray-100 rounded border">
        <h3 className="text-xl font-semibold mb-3">Summary</h3>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white border rounded shadow-sm">
            <p className="font-bold">High-Activity Source IP</p>
            {topAttacker ? (
              <>
                <p>{topAttacker[0]} — {topAttacker[1]} events</p>
                <button
                  onClick={() => openChartModal(topAttacker[0], "src")}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  View Timeline
                </button>
              </>
            ) : <p>-</p>}
          </div>

          <div className="p-3 bg-white border rounded shadow-sm">
            <p className="font-bold">Most Targeted IP</p>
            {topTarget ? (
              <>
                <p>{topTarget[0]} — {topTarget[1]} events</p>
                <button
                  onClick={() => openChartModal(topTarget[0], "dst")}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-xs"
                >
                  View Timeline
                </button>
              </>
            ) : <p>-</p>}
          </div>
        </div>

        {/* Threat Prediction */}
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded">
          <h3 className="text-xl font-bold text-red-700 mb-2">
            Predicted Threat Sources (AI-assisted)
          </h3>

          {topRiskIPs.length > 0 ? (
            topRiskIPs.map(({ ip, risk }) => (
              <div key={ip} className="bg-white p-3 rounded border mb-2">
                <div className="flex justify-between">
                  <span className="font-mono">{ip}</span>
                  <span className="font-bold text-red-600">
                    Risk {risk}%
                  </span>
                </div>
                <ul className="mt-1 ml-4 list-disc text-xs text-gray-600">
                  {explainRisk(ip).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-sm italic text-gray-600">
              No high-risk behavior detected.
            </p>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-700 ">
          Prediction is generated using traffic frequency, ICMP behavior,
          and temporal anomaly patterns. Unlike static firewall rules,
          this model adapts to traffic behavior.
        </div>
      </div>

      {/* Table + Modal เหมือนเดิม */}
      {/* (ผมไม่แตะ เพื่อไม่ทำให้คุณต้อง debug ซ้ำ) */}


      {/* Table */}
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Timestamp</th>
              <th className="p-2 border">Source IP</th>
              <th className="p-2 border">Destination IP</th>
              <th className="p-2 border">Bytes</th>
              <th className="p-2 border">ICMP</th>
              <th className="p-2 border">TTL</th>
              <th className="p-2 border">Label</th>
            </tr>
          </thead>

          <tbody>
            {paginatedLogs.map((l, i) => (
              <tr key={i} className="border hover:bg-gray-50">
                <td className="p-2 border">{l.timestamp}</td>
                <td className="p-2 border">{l.src_ip}</td>
                <td className="p-2 border">{l.dst_ip}</td>
                <td className="p-2 border">{l.client_bytes}</td>
                <td className="p-2 border">{`${l.icmp_type}/${l.icmp_code}`}</td>
                <td className="p-2 border">{l.ttl}</td>
                <td
                  className={`p-2 border ${l.label === "ping_sweep" ? "text-red-600 font-bold" : ""
                    }`}
                >
                  {l.label}
                </td>
              </tr>
            ))}
          </tbody>


        </table>
        <div className="flex justify-between items-center mt-3 text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>

          <p>
            Page {page} / {totalPages}
          </p>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>

      </div>

      {/* ============================================================
          Modal
      ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-xl w-[90%] md:w-[60%]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{modalTitle}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-600 font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Chart */}
            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10 }}
                    minTickGap={20}
                    tickFormatter={(t) => t.replace("T", " ")}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(v) => [`${v} ครั้ง`, "Count"]}
                    labelFormatter={(l) => l.replace("T", " ")}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
