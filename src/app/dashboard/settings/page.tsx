"use client";

import { API_BASE_URL } from "@/constants/system";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type AppVersionSettings = {
  required_version: string;
  latest_version: string;
  force_update: boolean;
  android_store_url: string;
  ios_store_url: string;
};

const emptySettings: AppVersionSettings = {
  required_version: "",
  latest_version: "",
  force_update: true,
  android_store_url: "",
  ios_store_url: "",
};

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppVersionSettings>(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchSettings = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/app-version-settings`, {
        headers: authHeaders(),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      if (!response.ok) {
        throw new Error("تعذر تحميل الإعدادات");
      }

      const data = (await response.json()) as AppVersionSettings;
      setSettings(data);
    } catch (fetchError) {
      console.error(fetchError);
      setError("تعذر تحميل إعدادات إصدار التطبيق");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
      return;
    }

    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/app-version-settings`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(settings),
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "تعذر حفظ الإعدادات");
        return;
      }

      if (data.settings) {
        setSettings(data.settings);
      }

      if (data.notifications?.queued) {
        setMessage(
          `تم حفظ الإعدادات. جاري إرسال إشعار التحديث إلى ${data.notifications.totalRecipients} مستخدم على دفعات (${data.notifications.batchSize} مستخدمين في كل دفعة، ${data.notifications.totalBatches} دفعة).`
        );
      } else if (data.notifications?.totalRecipients === 0 && data.settings) {
        setMessage(
          "تم حفظ الإعدادات. لا يوجد مستخدمون لديهم رمز إشعارات مسجل حالياً."
        );
      } else {
        setMessage("تم حفظ إعدادات إصدار التطبيق بنجاح");
      }
    } catch (submitError) {
      console.error(submitError);
      setError("حدث خطأ أثناء حفظ الإعدادات");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8" dir="rtl">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-2xl font-bold text-[#303d36]">
          إعدادات إصدار التطبيق
        </h1>
        <p className="mb-8 text-sm text-gray-600">
          تحكم في إجبار المستخدمين على تحديث التطبيق من متجر Google Play أو App
          Store عند عدم تطابق الإصدار. عند تغيير الإصدار وحفظ الإعدادات، يُرسل
          إشعار تحديث لجميع المستخدمين على دفعات (10 مستخدمين في كل دفعة).
        </p>

        {loading ? (
          <p className="text-gray-600">جاري تحميل الإعدادات...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-xl bg-white p-6 shadow-md"
          >
            <div>
              <label
                htmlFor="required_version"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                الإصدار المطلوب
              </label>
              <input
                id="required_version"
                type="text"
                value={settings.required_version}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    required_version: event.target.value,
                  }))
                }
                placeholder="مثال: 1.2.0"
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-right outline-none"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                إذا كان إصدار التطبيق لدى المستخدم مختلفًا، سيظهر له تنبيه
                التحديث الإجباري.
              </p>
            </div>

            <div>
              <label
                htmlFor="latest_version"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                أحدث إصدار
              </label>
              <input
                id="latest_version"
                type="text"
                value={settings.latest_version}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    latest_version: event.target.value,
                  }))
                }
                placeholder="مثال: 1.2.0"
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-right outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <div>
                <p className="font-medium text-gray-800">تفعيل التحديث الإجباري</p>
                <p className="text-xs text-gray-500">
                  عند التفعيل، لن يتمكن المستخدم من استخدام التطبيق قبل التحديث.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setSettings((prev) => ({
                    ...prev,
                    force_update: !prev.force_update,
                  }))
                }
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  settings.force_update ? "bg-[#303d36]" : "bg-gray-300"
                }`}
                aria-pressed={settings.force_update}
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-all ${
                    settings.force_update ? "left-0.5" : "left-5"
                  }`}
                />
              </button>
            </div>

            <div>
              <label
                htmlFor="android_store_url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رابط Google Play
              </label>
              <input
                id="android_store_url"
                type="url"
                value={settings.android_store_url}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    android_store_url: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-right outline-none"
                required
              />
            </div>

            <div>
              <label
                htmlFor="ios_store_url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رابط App Store
              </label>
              <input
                id="ios_store_url"
                type="url"
                value={settings.ios_store_url}
                onChange={(event) =>
                  setSettings((prev) => ({
                    ...prev,
                    ios_store_url: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-right outline-none"
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
              disabled={saving}
              className="w-full rounded-lg bg-[#303d36] px-4 py-3 font-semibold text-white transition-opacity disabled:opacity-60"
            >
              {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
