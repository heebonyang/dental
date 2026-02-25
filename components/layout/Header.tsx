"use client";
import { useDentalStore } from "@/lib/dentalStore";

export default function Header() {
  const patient = useDentalStore((s) => s.record.patient);
  const resetChart = useDentalStore((s) => s.resetChart);

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="font-semibold text-gray-800">치과 차트</div>
      <div className="text-sm text-gray-500">{patient.name || "환자 없음"}</div>
      <button onClick={resetChart} className="text-sm text-red-500 hover:underline">
        초기화
      </button>
    </header>
  );
}
