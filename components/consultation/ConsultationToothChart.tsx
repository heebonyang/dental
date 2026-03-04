"use client";
import { useActiveRecord } from "@/lib/dentalStore";
import { UPPER_ARCH_ORDER, LOWER_ARCH_ORDER } from "@/lib/constants";
import type { ToothData } from "@/lib/types";
import ToothSVG from "@/components/dental-chart/ToothSVG";
import { getGroup, GROUP_META, type ConsultGroup } from "@/lib/consultationGroups";

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
        backgroundColor: isHighlighted ? meta.hexBg : undefined,
      }}
    >
      {isUpper && (
        <span className="text-[9px] leading-none text-gray-400 font-medium">{tooth.fdi}</span>
      )}
      <ToothSVG
        toothType={tooth.type}
        arch={tooth.arch}
        status={tooth.status}
        width={44}
        height={64}
      />
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
