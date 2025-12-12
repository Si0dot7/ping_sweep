import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ping sweep model monitor",
  description: "ping sweep model monitor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const isLogin = pathname === "/";

  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="pt-15">
          {children}
        </div>
      </body>
    </html>
  );
}
