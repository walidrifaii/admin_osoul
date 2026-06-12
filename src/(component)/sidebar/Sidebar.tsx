// components/Sidebar.tsx

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [auth, setAuth] = React.useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (token) {
      setAuth(true);
    }
  }, []);
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/dashboard/regUsers",
      label: "المستخدمين المسجلين",
    },
    {
      href: "/dashboard/waitingUsers",
      label: "المستخدمين قيد الانتظار",
    },
    {
      href: "/dashboard/Listings",
      label: "المنشورات",
    },
    {
      href: "/dashboard/settings",
      label: "إعدادات التطبيق",
    },
  ];
  if (auth === false) {
    return null;
  } else {
    return (
      <div className="h-screen inline-block text-white shadow-lg w-[25vh]">
        <nav className="bg-gray-800 h-full w-full" dir="rtl">
          <div className="p-4 text-white">
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>

          <ul className="mt-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <li
                  key={link.href}
                  className={`px-6 py-2 rounded transition-colors ${
                    isActive
                      ? "bg-[#303d36] font-bold text-white"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <Link href={link.href} className="block w-full h-full">
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
}
