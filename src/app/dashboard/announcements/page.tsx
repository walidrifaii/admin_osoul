"use client";

import { API_BASE_URL } from "@/constants/system";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type AnnouncementForm = {
  title: string;
  body: string;
};

const emptyForm: AnnouncementForm = {
  title: "",
  body: "",
};

function PhoneMockup({ title, body }: { title: string; body: string }) {
  const displayTitle = title.trim() || "عنوان الإشعار";
  const displayBody =
    body.trim() || "نص الإشعار يظهر هنا أثناء الكتابة...";
  const now = new Date();
  const time = now.toLocaleTimeString("ar-QA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative h-[560px] w-[280px] shrink-0 rounded-[2.5rem] border-[10px] border-zinc-900 bg-zinc-900 shadow-2xl"
        aria-hidden={!title && !body}
      >
        <div className="absolute -left-[14px] top-24 h-8 w-[4px] rounded-l bg-zinc-800" />
        <div className="absolute -left-[14px] top-40 h-12 w-[4px] rounded-l bg-zinc-800" />
        <div className="absolute -left-[14px] top-56 h-12 w-[4px] rounded-l bg-zinc-800" />
        <div className="absolute -right-[14px] top-36 h-16 w-[4px] rounded-r bg-zinc-800" />

        <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900">
          <div className="absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          <div className="absolute inset-x-0 top-0 z-10 flex flex-row-reverse items-center justify-between px-6 pt-3 text-[11px] font-medium text-white">
            <span>{time}</span>
            <div className="flex flex-row-reverse items-center gap-1">
              <span className="text-[10px]">5G</span>
              <div className="flex h-2.5 items-end gap-0.5">
                <span className="h-1 w-0.5 rounded-sm bg-white" />
                <span className="h-1.5 w-0.5 rounded-sm bg-white" />
                <span className="h-2 w-0.5 rounded-sm bg-white" />
                <span className="h-2.5 w-0.5 rounded-sm bg-white/50" />
              </div>
              <div className="h-2.5 w-5 rounded-sm border border-white/80 p-[1px]">
                <div className="h-full w-3/4 rounded-[1px] bg-white" />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#303d36]/30 blur-3xl" />

          <div className="mt-16 text-center text-white">
            <p className="text-5xl font-light tracking-tight">{time}</p>
            <p className="mt-1 text-xs text-white/70">
              {now.toLocaleDateString("ar-QA", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          <div className="absolute inset-x-3 top-[9.5rem] z-30">
            <div
              dir="rtl"
              className={`rounded-2xl bg-white/90 p-3 shadow-lg backdrop-blur-md transition-all duration-200 ${
                title.trim() || body.trim()
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-70"
              }`}
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#303d36] text-[10px] font-bold text-white">
                  O
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                      Osoul
                    </p>
                    <span className="shrink-0 text-[10px] text-zinc-400">الآن</span>
                  </div>
                </div>
              </div>
              <p
                className={`truncate text-[13px] font-semibold text-zinc-900 ${
                  !title.trim() ? "text-zinc-400" : ""
                }`}
              >
                {displayTitle}
              </p>
              <p
                className={`mt-0.5 line-clamp-3 text-[12px] leading-relaxed text-zinc-600 ${
                  !body.trim() ? "text-zinc-400" : ""
                }`}
              >
                {displayBody}
              </p>
            </div>
          </div>

          <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-white/40" />
        </div>
      </div>
      <p className="text-xs text-gray-500">معاينة مباشرة أثناء الكتابة</p>
    </div>
  );
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/send-announcement`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "تعذر إرسال الإعلان");
        return;
      }

      if (data.notifications?.queued) {
        setMessage(
          `جاري إرسال الإعلان إلى ${data.notifications.totalRecipients} مستخدم على دفعات (${data.notifications.batchSize} مستخدمين في كل دفعة، ${data.notifications.totalBatches} دفعة).`
        );
      } else if (data.notifications?.totalRecipients === 0) {
        setMessage("لا يوجد مستخدمون لديهم رمز إشعارات مسجل حالياً.");
      } else {
        setMessage("تم إرسال الإعلان بنجاح");
      }
    } catch (submitError) {
      console.error(submitError);
      setError("حدث خطأ أثناء إرسال الإعلان");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8"
      dir="rtl"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-1 text-xl font-bold text-[#303d36] sm:mb-2 sm:text-2xl">
          الإعلانات
        </h1>
        <p className="mb-6 text-xs leading-relaxed text-gray-600 sm:mb-8 sm:text-sm">
          اكتب إشعارك بالعربية وشاهده مباشرة على هاتف وهمي قبل الإرسال لجميع
          المستخدمين.
        </p>

        <div
          className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8"
          dir="ltr"
        >
          <div className="flex w-full shrink-0 justify-center overflow-x-auto pb-2 xl:w-auto xl:overflow-visible xl:pb-0">
            <div className="xl:sticky xl:top-6">
              <PhoneMockup title={form.title} body={form.body} />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="min-w-0 w-full flex-1 space-y-4 rounded-xl bg-white p-4 shadow-md sm:space-y-5 sm:p-6"
            dir="rtl"
          >
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                العنوان
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                placeholder="مثال: إعلان من أصول"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right outline-none focus:border-[#303d36] focus:bg-white"
                required
              />
            </div>

            <div>
              <label
                htmlFor="body"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                نص الإعلان
              </label>
              <textarea
                id="body"
                rows={5}
                value={form.body}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, body: event.target.value }))
                }
                placeholder="اكتب نص الإشعار بالعربية..."
                className="w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-right outline-none focus:border-[#303d36] focus:bg-white"
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-[#303d36] px-4 py-3 font-semibold text-white transition-opacity disabled:opacity-60"
            >
              {sending ? "جاري الإرسال..." : "إرسال الإعلان"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
