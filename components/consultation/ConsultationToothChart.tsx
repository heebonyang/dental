"use client";
import { useState } from "react";
import { useActiveRecord } from "@/lib/dentalStore";
import { UPPER_ARCH_ORDER, LOWER_ARCH_ORDER } from "@/lib/constants";
import type { ToothCondition, ToothData } from "@/lib/types";
import ToothSVG from "@/components/dental-chart/ToothSVG";

// ── 5색 상태 그룹 ─────────────────────────────────────────────────────────────
type ConsultGroup = "normal" | "treatment" | "restoration" | "missing" | "perio";

const GROUP_META: Record<ConsultGroup, { label: string; color: string; bg: string; border: string }> = {
  normal:      { label: "정상",       color: "#22c55e", bg: "#f0fdf4", border: "#86efac" },
  treatment:   { label: "치료 필요",  color: "#ef4444", bg: "#fef2f2", border: "#fca5a5" },
  restoration: { label: "보철/충전",  color: "#eab308", bg: "#fefce8", border: "#fde047" },
  missing:     { label: "결손/임플",  color: "#f97316", bg: "#fff7ed", border: "#fdba74" },
  perio:       { label: "치주 관리",  color: "#3b82f6", bg: "#eff6ff", border: "#93c5fd" },
};

function getGroup(status: ToothCondition): ConsultGroup {
  switch (status) {
    case "healthy":
    case "sealant":
    case "watch":
      return "normal";
    case "caries":
    case "extraction_indicated":
    case "fracture":
    case "crack":
    case "root_canal":
      return "treatment";
    case "crown_pfc":
    case "crown_full_ceramic":
    case "crown_gold":
    case "crown_temporary":
    case "filling_composite":
    case "filling_amalgam":
    case "filling_glass_ionomer":
    case "bridge_abutment":
    case "bridge_pontic":
    case "post_and_core":
    case "veneer":
      return "restoration";
    case "missing":
    case "implant":
    case "implant_crown":
    case "impacted":
      return "missing";
    case "periodontal_mild":
    case "periodontal_moderate":
    case "periodontal_severe":
      return "perio";
    default:
      return "normal";
  }
}

interface ToothCellProps {
  tooth: ToothData;
  isHighlighted: boolean;
  onClick: () => void;
}

function ConsultToothCell({ tooth, isHighlighted, onClick }: ToothCellProps) {
  const group = getGroup(tooth.status);
  const meta = GROUP_META[group];
  const isUpper = tooth.arch === "upper";

  return (
    <button
      onClick={onClick}
      title={`${tooth.fdi} — ${tooth.name}`}
      className="flex flex-col items-center gap-[2px] px-[2px] py-1 rounded transition-all focus:outline-none"
      style={{
        outline: isHighlighted ? `2px solid ${meta.color}` : undefined,
        backgroundColor: isHighlighted ? meta.bg : undefined,
      }}
    >
      {isUpper && (
        <span className="text-[9px] leading-none text-gray-400 font-medium">{tooth.fdi}</span>
      )}
      {/* 크기 44×64로 확대 */}
      <div style={{ width: 44, height: 64, transform: "scale(1.22)", transformOrigin: "center" }}>
        <ToothSVG toothType={tooth.type} arch={tooth.arch} status={tooth.status} />
      </div>
      {/* 그룹 색상 도트 */}
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {!isUpper && (
        <span className="text-[9px] leading-none text-gray-400 font-medium">{tooth.fdi}</span>
      )}
    </button>
  );
}

interface Props {
  highlightedToothId: number | null;
  onToothClick: (id: number) => void;
}

export default function ConsultationToothChart({ highlightedToothId, onToothClick }: Props) {
  const record = useActiveRecord();

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4">
      {/* 상악 */}
      <div className="flex justify-center gap-0 overflow-x-auto">
        {UPPER_ARCH_ORDER.map((id) => (
          <ConsultToothCell
            key={id}
            tooth={record.teeth[id]}
            isHighlighted={highlightedToothId === id}
            onClick={() => onToothClick(id)}
          />
        ))}
      </div>

      {/* 교합선 */}
      <div className="border-t-2 border-dashed border-stone-300 my-2" />

      {/* 하악 */}
      <div className="flex justify-center gap-0 overflow-x-auto">
        {LOWER_ARCH_ORDER.map((id) => (
          <ConsultToothCell
            key={id}
            tooth={record.teeth[id]}
            isHighlighted={highlightedToothId === id}
            onClick={() => onToothClick(id)}
          />
        ))}
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap justify-center gap-3 mt-4 pt-3 border-t border-stone-100">
        {(Object.entries(GROUP_META) as [ConsultGroup, typeof GROUP_META[ConsultGroup]][]).map(([key, m]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="text-xs text-gray-600">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
