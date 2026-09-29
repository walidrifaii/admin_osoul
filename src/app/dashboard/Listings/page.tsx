"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/(component)/listingCard/Card";
import { categoryOptions, mapIdToTitle } from "@/utilities/mappingIds";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/system";

type Listing = {
  id: string;
  imageUrl: string;
  publisherName: string;
  phoneNumber: string;
  commercialRegNo: string;
  companyName: string;
  categoryTitle: string;
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

export default function Home() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      return;
    }

    const headers = authHeaders();
    if (!headers) {
      localStorage.removeItem("token");
      router.push("/");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/delete-post?post_id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers,
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.message || "Network response was not ok");
      }

      setListings((prev) => prev.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("تعذر حذف الإعلان");
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const headers = authHeaders();
      if (!headers) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/get-posts`, { headers });
        if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
        }
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setListings(
          Array.isArray(data)
            ? data.map(
                (item: {
                  id: string | number;
                  image: string | null;
                  user_full_name_ar: string;
                  phone: string;
                  commercial_reg: string;
                  title: string;
                  categorey: number;
                }) => ({
                  id: String(item.id),
                  imageUrl: item.image || "/logo.png",
                  publisherName: item.user_full_name_ar,
                  phoneNumber: item.phone,
                  commercialRegNo: item.commercial_reg,
                  companyName: item.title,
                  categoryTitle: mapIdToTitle(item.categorey),
                })
              )
            : []
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
        setListings([]);
      }
    };

    fetchPosts();
  }, [router]);

  const filtered = listings.filter((listing) => {
    const matchesCategory =
      category === "all" || listing.categoryTitle === category;
    const haystack = [
      listing.publisherName,
      listing.phoneNumber,
      listing.commercialRegNo,
      listing.companyName,
      listing.categoryTitle,
    ]
      .join(" ")
      .toLowerCase();
    return matchesCategory && haystack.includes(query.trim().toLowerCase());
  });

  return (
    <div
      className="min-h-full bg-gray-50 px-6 pb-16 pt-6"
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-center font-bold text-gray-900  mb-8">
          قائمة الإعلانات
        </h1>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو السجل أو العنوان"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
          />
          <div className="relative sm:min-w-[220px]">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          >
            <option value="all">كل التصنيفات</option>
            {categoryOptions.map((option) => (
              <option key={option.id} value={option.title}>
                {option.title}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          </div>
        </div>
        <div
          className="space-y-4 overflow-y-scroll max-h-[80vh] w-full p-4 px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {filtered.map((listing) => (
            <ListingCard
              key={listing.id}
              imageUrl={listing.imageUrl}
              publisherName={listing.publisherName}
              phoneNumber={listing.phoneNumber}
              commercialRegNo={listing.commercialRegNo}
              companyName={listing.companyName}
              categoryTitle={listing.categoryTitle}
              onDelete={() => handleDelete(listing.id)}
              onOpen={() => router.push(`/dashboard/Listings/${listing.id}`)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">لا توجد إعلانات متاحة</div>
          </div>
        )}
      </div>
    </div>
  );
}
