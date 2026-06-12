"use client";

import Image from "next/image";
import type React from "react";
import { Trash2, Phone, FileText, Tag, User } from "lucide-react";

export interface ListingCardProps {
  imageUrl: string;
  publisherName: string;
  phoneNumber: string;
  commercialRegNo: string;
  companyName: string;
  categoryTitle: string;
  onDelete?: () => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  imageUrl,
  publisherName,
  phoneNumber,
  commercialRegNo,
  companyName,
  categoryTitle,
  onDelete,
}) => {
  console.log("ListingCard rendered with props:", imageUrl);
  return (
    <div
      dir="rtl"
      className=" group relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Delete Button */}

      <button
        onClick={onDelete}
        className="absolute top-3 left-3 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200"
        aria-label="حذف الإعلان"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex h-[270px] overflow-hidden">
        {/* Image Section */}
        <div className="relative flex-shrink-0">
          <Image
            width={520}
            height={520}
            src={imageUrl}
            alt="صورة الإعلان"
            className="h-full w-[200px] object-fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 space-y-3">
          {/* Header with Category */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              <Tag className="w-3 h-3 ml-1" />
              {categoryTitle}
            </span>
          </div>

          {/* Company Name - Main Title */}
          <h3 className="text-lg font-bold text-gray-900 text-right leading-tight">
            {companyName}
          </h3>

          {/* Details Grid */}
          <div className="space-y-2">
            <div className="flex items-center text-right">
              <User className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600">
                  اسم الناشر:{" "}
                </span>
                <span className="text-sm text-gray-800">{publisherName}</span>
              </div>
            </div>

            <div className="flex items-center text-right">
              <Phone className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600">
                  رقم الهاتف:{" "}
                </span>
                <span className="text-sm text-gray-800 font-mono" dir="ltr">
                  {phoneNumber}
                </span>
              </div>
            </div>

            <div className="flex items-center text-right">
              <FileText className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-600">
                  رقم السجل التجاري:{" "}
                </span>
                <span className="text-sm text-gray-800">{commercialRegNo}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => {
                window.open(`https://wa.me/${phoneNumber}`, "_blank");
              }}
            >
              ارسال رسالة
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              onClick={() => {
                window.open(`tel:${phoneNumber}`);
              }}
            >
              اتصال
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
    </div>
  );
};

export default ListingCard;
