"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (username === "admin" && password === "123") {
      document.cookie = "token=123; path=/";
      router.push("/dash");
      ;
    }
    else{
      alert("Username or Password is not correct")
    }
  };

  return (
    <main className="bg-blue-900 min-h-screen w-full flex flex-col items-center rounded-sm border-blue-950 border-2">

      <div className="w-full flex justify-center px-4 mt-25">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 space-y-6">

          <div className="flex justify-center">
            <Image src="/favicon.ico" width={80} height={80} alt="logo" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-700">
            Login to Dashboard
          </h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold mb-1">UserName</label>
              <input
                type="text"
                className="w-full border rounded p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>

    </main>
  );
}
