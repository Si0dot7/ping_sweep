"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import LogViewer from "@/components/LogViewer";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        setTimeout(() => {
          setLogs(json);
          setLoading(false);   // เพิ่มตรงนี้
        }, 100);

      } catch (err) {
        alert("ไฟล์ไม่ใช่ JSON หรือรูปแบบผิด");
      }
    };

    reader.readAsText(file);
  };

  return (
    <main className="bg-blue-900 min-h-screen w-full p-6 flex justify-center">
      <div className="w-full max-w-6xl space-y-6">

        {/* Upload Section */}
        <div className="border p-5 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-3">Upload Log File</h2>
          <input
            type="file"
            accept=".json"
            onChange={handleUpload}
            className="border p-2"
          />
        </div>

        {/* Dashboard + Viewer */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <>
            <Dashboard logs={logs} />
            <LogViewer logs={logs} />
          </>
        )}


      </div>
    </main>
  );
}
