"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import LogViewer from "@/components/LogViewer";
import Head from "next/head";
import Image from "next/image";

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (event: any) => {
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
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full max-w-6xl space-y-6">

        {/* Upload Section */}
        <div className="border p-5 rounded bg-white shadow">
          <h2 className="ml-26 text-xl font-semibold mb-2">Upload Log File</h2>
          <div className="flex flex-wrap items-center justify-between">
            <input
              type="file"
              accept=".json"
              onChange={handleUpload}
              className="ml-28 border p-2 w-full sm:w-auto"
            />

            <Image
              src="/favicon.ico"
              width={280}
              height={40}
              alt="fav"
              className="object-contain mr-28"
            />
          </div>

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
