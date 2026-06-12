"use client";
import React, { useEffect, useState } from "react";
import Table from "@/(component)/table/Table";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/constants/system";
type User = {
  id: string;
  full_name_ar: string;
  user_phone: string;
  user_type: string;
  created_at: string;
  company_name_ar?: string;
};

export default function WaitUsers() {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);
  const FetchActiveUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/active-users?user_id=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        console.log("error deactivating user", response);
      }

      const data = await response.json();
      console.log("User deactivated successfully:", data);
      setUserList((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );
      alert("تم الموافقة على المستخدم بنجاح");
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-all-deactive-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return;
      }
      if (!response.ok) {
        console.log("error fetching users", response);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        setUserList([]);
        return;
      }
      const dataList = data.map((user: {
        user_id: string;
        full_name_ar: string;
        user_phone: string;
        user_type: string;
        created_at: string;
        company_name_ar: string | null;
      }) => ({
        id: user.user_id,
        full_name_ar: user.full_name_ar,
        user_phone: user.user_phone,
        user_type: user.user_type,
        created_at: new Date(user.created_at).toLocaleDateString("ar-EG"),
        company_name_ar: user.company_name_ar || "N/A",
      }));
      console.log("Fetched users:", data);
      setUserList(dataList);
      // Update userList with fetched data if needed
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token", token);
    if (!token) {
      router.replace("/");
    }
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return (
    <>
      <Table
        color="green"
        actionFun={FetchActiveUser}
        ButtonTit="موافقة"
        title={"المستخدمين في انتظار الموافقة"}
        rows={userList}
        headers={[
          "الاسم",
          "الجوال",
          "نوع الحساب",
          "تاريخ الانضمام",
          "اسم الشركة",
          "اجراء",
        ]}
      />
    </>
  );
}
