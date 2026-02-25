"use client";
import { useState } from "react";
import type { DentalRecord } from "@/lib/types";

interface PatientListProps {
  records: DentalRecord[];
  activeId: string;
  isDark: boolean;
  onSelect: (patientId: string) => void;
  onDelete: (patientId: string) => void;
}

/**
 * 환자 검색 입력 + 스크롤 가능한 환자 목록.
 * PatientExplorer의 중간 영역(flex-1)을 차지합니다.
 */
export default function PatientList({
  records,
  activeId,
  isDark,
  onSelect,
  onDelete,
}: PatientListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRecords = records.filter(
    (rec) =>
      !searchQuery ||
      rec.patient.name.includes(searchQuery) ||
      rec.patient.clinic.includes(searchQuery)
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 검색창 */}
      <div
        className={`px-2 py-2 border-b shrink-0 ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}
      >
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="환자 검색..."
          className={`w-full text-xs rounded px-2 py-1.5 border focus:outline-none ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-blue-500"
              : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-blue-400"
          }`}
        />
      </div>

      {/* 환자 목록 */}
      <div className={`flex-1 overflow-y-auto ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        {filteredRecords.map((rec) => {
          const isActive = rec.patient.id === activeId;
          return (
            <div
              key={rec.patient.id}
              onClick={() => onSelect(rec.patient.id)}
              className={`px-3 py-2.5 cursor-pointer border-b flex items-center justify-between group transition-colors border-l-2 ${
                isActive
                  ? isDark
                    ? "bg-blue-900/40 border-b-gray-800 border-l-blue-400"
                    : "bg-blue-50 border-b-gray-200 border-l-blue-400"
                  : isDark
                  ? "hover:bg-gray-800 border-b-gray-800 border-l-transparent"
                  : "hover:bg-gray-100 border-b-gray-200 border-l-transparent"
              }`}
            >
              <div className="min-w-0">
                <div
                  className={`text-sm font-medium truncate ${
                    isActive
                      ? isDark ? "text-blue-300" : "text-blue-700"
                      : isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {rec.patient.name || "이름 없음"}
                </div>
                <div className={`text-xs truncate ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  {rec.patient.clinic || "병원 미지정"}
                </div>
              </div>

              {records.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(rec.patient.id);
                  }}
                  className="text-gray-700 hover:text-red-400 text-xs ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}

        {filteredRecords.length === 0 && (
          <div className={`px-3 py-4 text-xs text-center ${isDark ? "text-gray-600" : "text-gray-400"}`}>
            검색 결과 없음
          </div>
        )}
      </div>
    </div>
  );
}
