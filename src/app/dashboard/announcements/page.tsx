"use client";

import { API_BASE_URL } from "@/constants/system";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type AnnouncementForm = {
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
};

type PreviewLang = "ar" | "en";

const emptyForm: AnnouncementForm = {
  title_ar: "",
  title_en: "",
  body_ar: "",
  body_en: "",
};

function PhoneMockup({
  title,
  body,
  lang,
}: {
  title: string;
  body: string;
  lang: PreviewLang;
}) {
  const isRtl = lang === "ar";
  const displayTitle =
    title.trim() || (isRtl ? "عنوان الإشعار" : "Notification title");
  const displayBody =
    body.trim() ||
    (isRtl
      ? "نص الإشعار يظهر هنا أثناء الكتابة..."
      : "Notification text appears here as you type...");
  const now = new Date();
  const time = now.toLocaleTimeString(isRtl ? "ar-QA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex w-full max-w-[280px] flex-col items-center gap-2 sm:gap-3">
      <div
        className="relative aspect-[9/19] w-full max-w-[210px] rounded-[2rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl sm:max-w-[240px] sm:rounded-[2.25rem] sm:border-[9px] md:max-w-[260px] lg:max-w-[280px] lg:rounded-[2.5rem] lg:border-[10px]"
        aria-hidden={!title && !body}
      >
        {/* Side buttons — hidden on very small screens */}
        <div className="absolute -left-[12px] top-[18%] hidden h-6 w-[3px] rounded-l bg-zinc-800 sm:block sm:-left-[13px] sm:h-7 lg:-left-[14px] lg:h-8 lg:w-[4px]" />
        <div className="absolute -left-[12px] top-[30%] hidden h-9 w-[3px] rounded-l bg-zinc-800 sm:block sm:-left-[13px] sm:h-10 lg:-left-[14px] lg:h-12 lg:w-[4px]" />
        <div className="absolute -left-[12px] top-[42%] hidden h-9 w-[3px] rounded-l bg-zinc-800 sm:block sm:-left-[13px] sm:h-10 lg:-left-[14px] lg:h-12 lg:w-[4px]" />
        <div className="absolute -right-[12px] top-[28%] hidden h-12 w-[3px] rounded-r bg-zinc-800 sm:block sm:-right-[13px] sm:h-14 lg:-right-[14px] lg:h-16 lg:w-[4px]" />

        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 sm:rounded-[1.7rem] lg:rounded-[1.9rem]">
          {/* Dynamic Island */}
          <div className="absolute left-1/2 top-2 z-20 h-4 w-16 -translate-x-1/2 rounded-full bg-black sm:top-3 sm:h-5 sm:w-20 lg:h-6 lg:w-24" />

          {/* Status bar */}
          <div
            className={`absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-2 text-[10px] font-medium text-white sm:px-5 sm:pt-2.5 sm:text-[11px] lg:px-6 lg:pt-3 ${
              isRtl ? "flex-row-reverse" : ""
            }`}
          >
            <span>{time}</span>
            <div
              className={`flex items-center gap-1 ${isRtl ? "flex-row-reverse" : ""}`}
            >
              <span className="text-[9px] sm:text-[10px]">5G</span>
              <div className="flex h-2 items-end gap-0.5 sm:h-2.5">
                <span className="h-1 w-0.5 rounded-sm bg-white" />
                <span className="h-1.5 w-0.5 rounded-sm bg-white" />
                <span className="h-2 w-0.5 rounded-sm bg-white" />
                <span className="h-2.5 w-0.5 rounded-sm bg-white/50" />
              </div>
              <div className="h-2 w-4 rounded-sm border border-white/80 p-[1px] sm:h-2.5 sm:w-5">
                <div className="h-full w-3/4 rounded-[1px] bg-white" />
              </div>
            </div>
          </div>

          {/* Wallpaper ambience */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
          <div className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#303d36]/30 blur-3xl sm:h-40 sm:w-40" />

          {/* Lock screen clock */}
          <div className="mt-12 text-center text-white sm:mt-14 lg:mt-16">
            <p className="text-3xl font-light tracking-tight sm:text-4xl lg:text-5xl">
              {time}
            </p>
            <p className="mt-0.5 px-2 text-[10px] text-white/70 sm:mt-1 sm:text-xs">
              {now.toLocaleDateString(isRtl ? "ar-QA" : "en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>

          {/* Live notification banner */}
          <div className="absolute inset-x-2 top-[7.5rem] z-30 sm:inset-x-2.5 sm:top-[8.5rem] lg:inset-x-3 lg:top-[9.5rem]">
            <div
              dir={isRtl ? "rtl" : "ltr"}
              className={`rounded-xl bg-white/90 p-2.5 shadow-lg backdrop-blur-md transition-all duration-200 sm:rounded-2xl sm:p-3 ${
                title.trim() || body.trim()
                  ? "translate-y-0 opacity-100"
                  : "translate-y-1 opacity-70"
              }`}
            >
              <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#303d36] text-[9px] font-bold text-white sm:h-7 sm:w-7 sm:rounded-lg sm:text-[10px]">
                  O
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-zinc-500 sm:text-[11px]">
                      Osoul
                    </p>
                    <span className="shrink-0 text-[9px] text-zinc-400 sm:text-[10px]">
                      {isRtl ? "الآن" : "now"}
                    </span>
                  </div>
                </div>
              </div>
              <p
                className={`truncate text-[12px] font-semibold text-zinc-900 sm:text-[13px] ${
                  !title.trim() ? "text-zinc-400" : ""
                }`}
              >
                {displayTitle}
              </p>
              <p
                className={`mt-0.5 line-clamp-3 text-[11px] leading-relaxed text-zinc-600 sm:text-[12px] ${
                  !body.trim() ? "text-zinc-400" : ""
                }`}
              >
                {displayBody}
              </p>
            </div>
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/40 sm:bottom-2 sm:w-24 lg:w-28" />
        </div>
      </div>
      <p className="text-center text-[11px] text-gray-500 sm:text-xs">
        معاينة مباشرة أثناء الكتابة
      </p>
    </div>
  );
}

export default function AnnouncementsPage() {
  const router = useRouter();
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);
  const [previewLang, setPreviewLang] = useState<PreviewLang>("ar");
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

  const previewTitle = previewLang === "ar" ? form.title_ar : form.title_en;
  const previewBody = previewLang === "ar" ? form.body_ar : form.body_en;

  const langToggle = (
    <div className="flex rounded-full bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => setPreviewLang("ar")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 ${
          previewLang === "ar"
            ? "bg-[#303d36] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        عربي
      </button>
      <button
        type="button"
        onClick={() => setPreviewLang("en")}
        className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 ${
          previewLang === "en"
            ? "bg-[#303d36] text-white"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        English
      </button>
    </div>
  );

  return (
    <div className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 md:p-8" dir="rtl">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="mb-1 text-xl font-bold text-[#303d36] sm:mb-2 sm:text-2xl">
          الإعلانات
        </h1>
        <p className="mb-6 text-xs leading-relaxed text-gray-600 sm:mb-8 sm:text-sm">
          اكتب إشعارك بالعربية والإنجليزية، وشاهده مباشرة على هاتف وهمي قبل
          الإرسال لجميع المستخدمين.
        </p>

        <div
          className="flex flex-col gap-6 xl:flex-row xl:items-start xl:gap-8"
          dir="ltr"
        >
          {/* Phone mockup — top on mobile, left on desktop */}
          <div className="order-1 flex w-full shrink-0 justify-center xl:w-auto">
            <div className="flex w-full max-w-[280px] flex-col items-center gap-3 xl:sticky xl:top-6">
              {langToggle}
              <PhoneMockup
                title={previewTitle}
                body={previewBody}
                lang={previewLang}
              />
            </div>
          </div>

          {/* Form — below on mobile, right on desktop */}
          <form
            onSubmit={handleSubmit}
            className="order-2 min-w-0 w-full flex-1 space-y-4 rounded-xl bg-white p-4 shadow-md sm:space-y-5 sm:p-6"
            dir="rtl"
          >
            <div>
              <label
                htmlFor="title_ar"
                className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
              >
                العنوان (عربي)
              </label>
              <input
                id="title_ar"
                type="text"
                value={form.title_ar}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    title_ar: event.target.value,
                  }));
                  setPreviewLang("ar");
                }}
                placeholder="مثال: إعلان من أصول"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-right outline-none focus:border-[#303d36] focus:bg-white sm:px-4 sm:py-3 sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="body_ar"
                className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
              >
                نص الإعلان (عربي)
              </label>
              <textarea
                id="body_ar"
                rows={3}
                value={form.body_ar}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    body_ar: event.target.value,
                  }));
                  setPreviewLang("ar");
                }}
                placeholder="اكتب نص الإشعار بالعربية..."
                className="min-h-[5.5rem] w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-right outline-none focus:border-[#303d36] focus:bg-white sm:min-h-[7rem] sm:px-4 sm:py-3 sm:text-base"
                required
              />
            </div>

            <div className="border-t border-gray-100 pt-4 sm:pt-5">
              <label
                htmlFor="title_en"
                className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
              >
                العنوان (English)
              </label>
              <input
                id="title_en"
                type="text"
                dir="ltr"
                value={form.title_en}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    title_en: event.target.value,
                  }));
                  setPreviewLang("en");
                }}
                placeholder="e.g. Announcement from Osoul"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-left outline-none focus:border-[#303d36] focus:bg-white sm:px-4 sm:py-3 sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="body_en"
                className="mb-1.5 block text-sm font-medium text-gray-700 sm:mb-2"
              >
                نص الإعلان (English)
              </label>
              <textarea
                id="body_en"
                rows={3}
                dir="ltr"
                value={form.body_en}
                onChange={(event) => {
                  setForm((prev) => ({
                    ...prev,
                    body_en: event.target.value,
                  }));
                  setPreviewLang("en");
                }}
                placeholder="Write the notification in English..."
                className="min-h-[5.5rem] w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-left outline-none focus:border-[#303d36] focus:bg-white sm:min-h-[7rem] sm:px-4 sm:py-3 sm:text-base"
                required
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 sm:px-4 sm:py-3">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-lg bg-green-50 px-3 py-2.5 text-sm text-green-700 sm:px-4 sm:py-3">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-lg bg-[#303d36] px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-60 sm:text-base"
            >
              {sending ? "جاري الإرسال..." : "إرسال الإعلان"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
