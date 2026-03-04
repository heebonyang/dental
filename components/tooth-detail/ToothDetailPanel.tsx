"use client";
import { useRef } from "react";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { CONDITION_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ToothCondition } from "@/lib/types";

const CONDITION_GROUPS: { label: string; keys: ToothCondition[] }[] = [
  { label: "기본",      keys: ["healthy", "watch"] },
  { label: "충치·수복",  keys: ["caries", "sealant", "filling_composite", "filling_amalgam", "filling_glass_ionomer"] },
  { label: "크라운",    keys: ["crown_pfc", "crown_full_ceramic", "crown_gold", "crown_temporary", "veneer"] },
  { label: "신경·코어",  keys: ["root_canal", "post_and_core"] },
  { label: "치주",      keys: ["periodontal_mild", "periodontal_moderate", "periodontal_severe"] },
  { label: "결손·보철",  keys: ["missing", "extraction_indicated", "implant", "implant_crown", "bridge_abutment", "bridge_pontic", "impacted"] },
  { label: "기타",      keys: ["fracture", "crack"] },
];

export default function ToothDetailPanel() {
  const record          = useActiveRecord();
  const selectedTooth   = useDentalStore((s) => s.selectedTooth);
  const selectTooth     = useDentalStore((s) => s.selectTooth);
  const setToothStatus  = useDentalStore((s) => s.setToothStatus);
  const updateToothNote = useDentalStore((s) => s.updateToothNote);
  const debounceTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tooth = selectedTooth != null ? record.teeth[selectedTooth] : null;
  if (!tooth) return null;

  const currentMeta = CONDITION_META[tooth.status];

  function handleSetStatus(condition: ToothCondition) {
    setToothStatus(tooth!.id, condition);
  }

  function handleNoteChange(value: string) {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => updateToothNote(tooth!.id, value), 300);
  }

  return (
    <div className="w-56 shrink-0 bg-white rounded-lg border border-gray-200 flex flex-col overflow-hidden self-start">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="min-w-0">
          <span className="font-semibold text-sm text-gray-800">{tooth.fdi}번</span>
          <span className="text-[11px] text-gray-400 ml-1.5 truncate">{tooth.name}</span>
        </div>
        <button
          onClick={() => selectTooth(null)}
          className="ml-2 shrink-0 w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 text-base leading-none"
        >
          ×
        </button>
      </div>

      {/* 현재 상태 */}
      <div className="px-3 py-2 border-b border-gray-100">
        <p className="text-[10px] text-gray-400 mb-1">현재 상태</p>
        <span
          className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-xs font-medium"
          style={{ backgroundColor: currentMeta.dotColor + "22", color: currentMeta.dotColor }}
        >
          {currentMeta.icon} {currentMeta.label}
        </span>
      </div>

      {/* 상태 선택 그룹 */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {CONDITION_GROUPS.map(({ label, keys }) => (
          <div key={label}>
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
              {label}
            </p>
            <div className="flex flex-wrap gap-1">
              {keys.map((key) => {
                const meta = CONDITION_META[key];
                const isActive = tooth.status === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleSetStatus(key)}
                    className={cn(
                      "px-2 py-[3px] rounded text-xs font-medium border transition-all",
                      isActive
                        ? "border-transparent text-white shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    )}
                    style={isActive ? { backgroundColor: meta.dotColor } : undefined}
                  >
                    {meta.icon} {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 메모 */}
      <div className="px-3 py-2 border-t border-gray-100">
        <p className="text-[10px] text-gray-400 mb-1">메모</p>
        <textarea
          key={tooth.id}
          defaultValue={tooth.note}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="치아별 메모..."
          className="w-full text-xs border border-gray-200 rounded p-2 resize-none h-14 focus:outline-none focus:border-blue-300"
        />
      </div>
    </div>
  );
}
