"use client";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";

interface HeaderProps {
  isLayoutEditMode: boolean;
  onToggleLayoutEdit: () => void;
}

export default function Header({ isLayoutEditMode, onToggleLayoutEdit }: HeaderProps) {
  const active     = useActiveRecord();
  const resetChart = useDentalStore((s) => s.resetChart);

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-2.5 flex items-center justify-between shrink-0">
      <div className="font-semibold text-white text-sm tracking-tight">치과 차트</div>
      <div className="text-xs text-gray-400">
        {active.patient.name
          ? `${active.patient.name}${active.patient.clinic ? ` · ${active.patient.clinic}` : ""}`
          : "환자 미선택"}
      </div>
      <div className="flex items-center gap-3">
        {isLayoutEditMode ? (
          <button
            onClick={onToggleLayoutEdit}
            className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded font-medium transition-colors"
          >
            ✓ 확정
          </button>
        ) : (
          <button
            onClick={onToggleLayoutEdit}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            레이아웃 수정
          </button>
        )}
        <button onClick={resetChart} className="text-xs text-red-500 hover:text-red-400 hover:underline">
          차트 초기화
        </button>
      </div>
    </header>
  );
}
