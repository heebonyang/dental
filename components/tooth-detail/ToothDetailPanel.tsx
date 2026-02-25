"use client";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { CONDITION_META } from "@/lib/constants";

export default function ToothDetailPanel() {
  const record         = useActiveRecord();
  const selectedTooth  = useDentalStore((s) => s.selectedTooth);
  const updateToothNote = useDentalStore((s) => s.updateToothNote);

  const tooth = selectedTooth ? record.teeth[selectedTooth] : null;

  if (!tooth) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-400">
        치아를 선택하면 상세 정보가 표시됩니다
      </div>
    );
  }

  const meta = CONDITION_META[tooth.status];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">
        {tooth.fdi}번 — {tooth.name}
      </h3>
      <div className="text-sm text-gray-500">
        {meta?.icon} {meta?.label ?? tooth.status}
      </div>
      <textarea
        value={tooth.note}
        onChange={(e) => updateToothNote(tooth.id, e.target.value)}
        placeholder="치아별 메모를 입력하세요..."
        className="w-full text-sm border border-gray-200 rounded p-2 resize-none h-20"
      />
    </div>
  );
}
