"use client";
import { useActiveRecord } from "@/lib/dentalStore";
import type { ToothCondition } from "@/lib/types";

type GroupKey = "treatment" | "restoration" | "missing" | "perio" | "normal";

interface GroupDef {
  key: GroupKey;
  label: string;
  emoji: string;
  bg: string;
  border: string;
  text: string;
  conditions: ToothCondition[];
}

const GROUPS: GroupDef[] = [
  {
    key: "treatment",
    label: "치료 필요",
    emoji: "🔴",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    conditions: ["caries", "extraction_indicated", "fracture", "crack", "root_canal"],
  },
  {
    key: "restoration",
    label: "보철/충전",
    emoji: "🟡",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-700",
    conditions: [
      "crown_pfc", "crown_full_ceramic", "crown_gold", "crown_temporary",
      "filling_composite", "filling_amalgam", "filling_glass_ionomer",
      "bridge_abutment", "bridge_pontic", "post_and_core", "veneer",
    ],
  },
  {
    key: "missing",
    label: "결손/임플",
    emoji: "🟠",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    conditions: ["missing", "implant", "implant_crown", "impacted"],
  },
  {
    key: "perio",
    label: "치주 관리",
    emoji: "🔵",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    conditions: ["periodontal_mild", "periodontal_moderate", "periodontal_severe"],
  },
  {
    key: "normal",
    label: "정상",
    emoji: "🟢",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    conditions: ["healthy", "sealant", "watch"],
  },
];

export default function ConditionSummaryCards() {
  const record = useActiveRecord();
  const teethList = Object.values(record.teeth);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {GROUPS.map((g) => {
        const matched = teethList.filter((t) =>
          (g.conditions as string[]).includes(t.status)
        );

        return (
          <div
            key={g.key}
            className={`rounded-xl border ${g.bg} ${g.border} p-4 shadow-sm flex flex-col gap-2`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{g.emoji}</span>
              <span className={`text-sm font-semibold ${g.text}`}>{g.label}</span>
            </div>
            <div className={`text-3xl font-bold ${g.text}`}>{matched.length}<span className="text-base font-normal ml-0.5">개</span></div>
            {matched.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {matched.map((t) => (
                  <span
                    key={t.id}
                    className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-white border ${g.border} ${g.text}`}
                  >
                    #{t.fdi}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">해당 없음</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
