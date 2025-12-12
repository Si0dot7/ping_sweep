"use client";

import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const hideLogout = pathname === "/"; // ถ้าอยู่หน้า login ซ่อนปุ่ม

    const handleLogout = () => {
            document.cookie = "token=; Max-Age=0; path=/";
            router.push("/");
    };

    return (
        <nav className="w-full h-16 bg-white shadow-md px-6 flex justify-between items-center fixed top-0 left-0 z-50">
            <h1 className="text-xl font-bold text-gray-700">Ping Sweep Model</h1>

            {!hideLogout && (
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition cursor-pointer"
                >
                    Logout
                </button>
            )}
        </nav>
    );
}
