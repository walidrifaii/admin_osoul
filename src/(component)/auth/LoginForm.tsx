"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard/regUsers");
    }
  }, [router]);

  const submitLogin = async () => {
    if (isSubmitting) {
      return;
    }

    const username = usernameRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!username || !password) {
      setError("الرجاء إدخال اسم المستخدم وكلمة المرور");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          (data as { message?: string }).message ||
            "اسم المستخدم أو كلمة المرور غير صحيحة"
        );
        return;
      }

      localStorage.setItem("token", (data as { token: string }).token);
      router.push("/dashboard/Listings");
    } catch {
      setError("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void submitLogin();
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center px-4">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="" width={320} height={125} />
      </div>

      <div
        dir="rtl"
        className="relative z-20 w-full max-w-md rounded-xl p-8 shadow-xl"
      >
        <h2 className="mb-6 text-right text-2xl tracking-wide text-[#303d36]">
          تسجيل دخول شاشة التحكم
        </h2>

        <div className="relative z-20 space-y-4">
          <div>
            <label htmlFor="username" className="sr-only">
              اسم المستخدم
            </label>
            <input
              ref={usernameRef}
              id="username"
              type="text"
              autoComplete="username"
              placeholder="اسم المستخدم"
              disabled={isSubmitting}
              onKeyDown={handleEnter}
              className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-right shadow-inner outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="كلمة المرور"
                disabled={isSubmitting}
                onKeyDown={handleEnter}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-right shadow-inner outline-none"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 left-3 flex items-center text-gray-500"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          {error ? (
            <p className="text-center text-sm text-red-600">{error}</p>
          ) : null}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void submitLogin()}
            className="relative z-30 w-full cursor-pointer rounded-lg bg-[#303d36] py-3 font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#29332d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </div>
      </div>

      <footer className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-center text-sm tracking-wider text-gray-600 opacity-80">
          أصول 2025 © جميع الحقوق محفوظة
        </p>
      </footer>
    </div>
  );
}
