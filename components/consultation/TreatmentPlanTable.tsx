"use client";
import { useActiveRecord } from "@/lib/dentalStore";
import { CONDITION_META } from "@/lib/constants";
import type { ToothCondition } from "@/lib/types";

const EXCLUDED: ToothCondition[] = ["healthy", "watch", "sealant"];

const PRIORITY_ORDER = { high: 0, mid: 1, low: 2 };

function formatCost(min?: number, max?: number): string {
  if (min == null && max == null) return "상담 필요";
  const fmt = (n: number) => n.toLocaleString("ko-KR") + "원";
  if (min === max) return fmt(min!);
  return `${fmt(min!)} ~ ${fmt(max!)}`;
}

interface Props {
  highlightedToothId: number | null;
  onRowClick: (id: number) => void;
}

export default function TreatmentPlanTable({ highlightedToothId, onRowClick }: Props) {
  const record = useActiveRecord();

  const rows = Object.values(record.teeth)
    .filter((t) => !(EXCLUDED as string[]).includes(t.status))
    .sort((a, b) => {
      const pa = CONDITION_META[a.status]?.priority ?? "mid";
      const pb = CONDITION_META[b.status]?.priority ?? "mid";
      const diff = (PRIORITY_ORDER[pa] ?? 1) - (PRIORITY_ORDER[pb] ?? 1);
      if (diff !== 0) return diff;
      return a.id - b.id;
    });

  // 총 비용 합산 (costMin/Max 있는 항목만)
  let totalMin = 0;
  let totalMax = 0;
  let hasCost = false;
  for (const t of rows) {
    const m = CONDITION_META[t.status];
    if (m?.costMin != null) { totalMin += m.costMin; hasCost = true; }
    if (m?.costMax != null) { totalMax += m.costMax; }
  }

  const priorityBadge = (p?: "high" | "mid" | "low") => {
    if (p === "high") return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-700">우선</span>;
    if (p === "mid")  return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 text-yellow-700">권장</span>;
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500">선택</span>;
  };

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 text-center text-gray-400 text-sm">
        치료가 필요한 치아가 없습니다.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">치아</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">치료 내용</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">우선순위</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">예상 비용</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((tooth) => {
              const meta = CONDITION_META[tooth.status];
              const isHL = highlightedToothId === tooth.id;
              return (
                <tr
                  key={tooth.id}
                  onClick={() => onRowClick(tooth.id)}
                  className={`cursor-pointer transition-colors ${isHL ? "bg-amber-50" : "hover:bg-stone-50"}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: meta?.dotColor ?? "#9ca3af" }}
                      >
                        {meta?.icon}
                      </span>
                      <span className="font-semibold text-gray-800">#{tooth.fdi}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{meta?.label ?? tooth.status}</td>
                  <td className="px-4 py-3 text-gray-700">{meta?.patientLabel ?? meta?.label ?? tooth.status}</td>
                  <td className="px-4 py-3">{priorityBadge(meta?.priority)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-700">
                    {meta?.costMin != null
                      ? formatCost(meta.costMin, meta.costMax)
                      : <span className="text-orange-600 text-xs font-semibold">임플란트 상담 필요</span>
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 총 비용 카드 */}
      {hasCost && (
        <div className="border-t border-stone-200 bg-stone-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">총 예상 비용</span>
          <span className="text-base font-bold text-gray-900">
            {totalMin.toLocaleString("ko-KR")}원 ~ {totalMax.toLocaleString("ko-KR")}원
          </span>
        </div>
      )}
    </div>
  );
}
