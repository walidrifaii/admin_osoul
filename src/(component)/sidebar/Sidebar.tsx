// components/Sidebar.tsx

"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    setAuth(false);
    router.push("/");
  };

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
      href: "/dashboard/announcements",
      label: "الإعلانات",
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
      <div className="h-full w-64 shrink-0 text-white shadow-lg">
        <nav className="flex h-full w-full flex-col bg-gray-800" dir="rtl">
          <div className="p-4 text-white">
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>

          <ul className="mt-4 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

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
          <div className="mt-auto p-4">
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              تسجيل الخروج
            </button>
          </div>
        </nav>
      </div>
    );
  }
}
