"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import LogViewer from "@/components/LogViewer";
import Head from "next/head";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Dash() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEmpty = !loading && logs.length === 0;

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
          setLoading(false);
        }, 100);
      } catch (err) {
        alert("ไฟล์ไม่ใช่ JSON หรือรูปแบบผิด");
      }
    };

    reader.readAsText(file);
  };

  return (
    <main className="bg-blue-900 min-h-screen w-full">

      {/* Navbar */}
      {/* <div className="w-full">
        <Navbar showLogout={true} />
      </div> */}

      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Body */}
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">

        {/* Upload Section */}
        {!isEmpty &&
        <div className="border p-5 rounded bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-center sm:text-left">
            Upload Log File
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <input
              type="file"
              accept=".json"
              onChange={handleUpload}
              className="border p-2 w-full sm:w-auto"
            />

            <Image
              src="/favicon.ico"
              width={200}
              height={40}
              alt="fav"
              className="object-contain "
            />
          </div>
        </div>
        }
        {/* Empty State */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center text-white">
            <Image
              src="/favicon.ico"
              width={200}
              height={40}
              alt="fav"
              className="object-contain py-15"
            />
            <h2 className="text-2xl font-semibold mb-2">
              No log file uploaded
            </h2>
            <p className="mb-6 opacity-80 text-center">
              Upload log file to start analysis
            </p>

            <label className="cursor-pointer bg-white text-blue-900 px-6 py-3 rounded shadow">
              Upload Log File
              <input
                type="file"
                accept=".json"
                onChange={handleUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Dashboard */}
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
