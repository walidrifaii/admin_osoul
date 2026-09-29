"use client";

import { API_BASE_URL } from "@/constants/system";
import {
  mapCity,
  mapCondition,
  mapIdToTitle,
  mapSaleType,
} from "@/utilities/mappingIds";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PostDetails = {
  id: string;
  title: string;
  phone: string;
  created_at: string;
  user_full_name_ar: string;
  commercial_reg: string;
  categorey: number;
  images: string[];
  caption: string | null;
  city_id: number | null;
  sale_type_id: number | null;
  condition_id: number | null;
  is_direct: boolean | null;
  area: string | number | null;
  building: string | number | null;
  price: string | number | null;
  rooms: string | number | null;
  toilets: string | number | null;
  land_area: string | number | null;
  address: string | null;
};

function authHeaders(): HeadersInit | null {
  const token = localStorage.getItem("token");
  if (!token || token === "null" || token === "undefined") {
    return null;
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function show(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

export default function ListingDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [post, setPost] = useState<PostDetails | null>(null);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const load = async () => {
      const headers = authHeaders();
      if (!headers) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/get-admin-post?post_id=${encodeURIComponent(params.id)}`,
          { headers }
        );
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }
        if (!response.ok) {
          throw new Error("failed");
        }
        const data = (await response.json()) as PostDetails;
        setPost(data);
      } catch {
        setError("تعذر تحميل تفاصيل الإعلان");
      }
    };

    if (params.id) load();
  }, [params.id, router]);

  const fields = post
    ? [
        ["التصنيف", mapIdToTitle(Number(post.categorey)) || "—"],
        ["اسم الناشر", show(post.user_full_name_ar)],
        ["رقم الهاتف", show(post.phone)],
        ["السجل التجاري", show(post.commercial_reg)],
        ["المدينة", mapCity(post.city_id)],
        ["نوع العرض", mapSaleType(post.sale_type_id)],
        ["الحالة", mapCondition(post.condition_id)],
        ["السعر", show(post.price)],
        ["المساحة", show(post.area)],
        ["مساحة الأرض", show(post.land_area)],
        ["المبنى", show(post.building)],
        ["الغرف", show(post.rooms)],
        ["الحمامات", show(post.toilets)],
        ["العنوان", show(post.address)],
        [
          "نوع البائع",
          post.is_direct == null ? "—" : post.is_direct ? "مباشر" : "وسيط",
        ],
        [
          "تاريخ النشر",
          post.created_at
            ? new Date(post.created_at).toLocaleDateString("ar-QA")
            : "—",
        ],
      ]
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl" style={{ flexGrow: 2 }}>
      <div className="mx-auto max-w-4xl">
        <button
          type="button"
          onClick={() => router.push("/dashboard/Listings")}
          className="mb-6 text-sm font-medium text-emerald-700"
        >
          العودة إلى القائمة
        </button>

        {error && <p className="text-center text-red-600">{error}</p>}
        {!post && !error && (
          <p className="text-center text-gray-500">جاري التحميل...</p>
        )}

        {post && (
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
            {post.images?.length > 0 && (
              <div className="bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.images[activeImage] || post.images[0]}
                  alt=""
                  className="h-80 w-full object-cover"
                />
                {post.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3">
                    {post.images.map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                          index === activeImage
                            ? "border-emerald-600"
                            : "border-transparent"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 p-6">
              <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
              <p className="whitespace-pre-wrap text-gray-700">
                {post.caption || "لا يوجد وصف"}
              </p>
              <dl className="grid gap-3 sm:grid-cols-2">
                {fields.map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
                    <dt className="text-xs text-gray-500">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-gray-900" dir="auto">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
