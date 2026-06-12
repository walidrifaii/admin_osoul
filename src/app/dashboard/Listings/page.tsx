"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/(component)/listingCard/Card";
import { mapIdToTitle } from "@/utilities/mappingIds";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/system";

export default function Home() {
  const router = useRouter();
  const [listings, setListings] = useState<
    Array<{
      id: number;
      imageUrl: string;
      publisherName: string;
      phoneNumber: string;
      commercialRegNo: string;
      companyName: string;
      categoryTitle: string;
    }>
  >([]);
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/delete-post?post_id=${id}&user_id=801ae98c-66a3-40b6-a34b-9192d248636f`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Delete response:", data);
      if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
        setListings(listings.filter((listing) => listing.id !== id));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get-posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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
              ? data.map((item: {
                  id: number;
                  image: string | null;
                  user_full_name_ar: string;
                  phone: string;
                  commercial_reg: string;
                  title: string;
                  categorey: number;
                }) => ({
                id: item.id,
                imageUrl: item.image || "/logo.png",
                publisherName: item.user_full_name_ar,
                phoneNumber: item.phone,
                commercialRegNo: item.commercial_reg,
                companyName: item.title,
                categoryTitle: mapIdToTitle(item.categorey),
              }))
            : []
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
        setListings([]);
      }
    };
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      fetchPosts();
    }
  }, [router]);
  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ flexGrow: 2 }}
      dir="rtl"
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-center font-bold text-gray-900  mb-8">
          قائمة الإعلانات
        </h1>
        {/* <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="ابحث عن اسم الشركة أو الناشر..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div> */}
        <div
          className="space-y-4 overflow-y-scroll max-h-[80vh] w-full p-4 px-8"
          style={{ scrollbarWidth: "none" }}
        >
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              imageUrl={listing.imageUrl}
              publisherName={listing.publisherName}
              phoneNumber={listing.phoneNumber}
              commercialRegNo={listing.commercialRegNo}
              companyName={listing.companyName}
              categoryTitle={listing.categoryTitle}
              onDelete={() => handleDelete(listing.id)}
            />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">لا توجد إعلانات متاحة</div>
          </div>
        )}
      </div>
    </div>
  );
}
