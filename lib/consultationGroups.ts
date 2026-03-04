import type { ToothCondition } from "@/lib/types";

export type ConsultGroup = "normal" | "treatment" | "restoration" | "missing" | "perio";

/** 그룹별 포함 조건 목록 — 단일 출처 */
export const GROUP_CONDITIONS: Record<ConsultGroup, ToothCondition[]> = {
  normal:      ["healthy", "sealant", "watch"],
  treatment:   ["caries", "extraction_indicated", "fracture", "crack", "root_canal"],
  restoration: [
    "crown_pfc", "crown_full_ceramic", "crown_gold", "crown_temporary",
    "filling_composite", "filling_amalgam", "filling_glass_ionomer",
    "bridge_abutment", "bridge_pontic", "post_and_core", "veneer",
  ],
  missing:     ["missing", "implant", "implant_crown", "impacted"],
  perio:       ["periodontal_mild", "periodontal_moderate", "periodontal_severe"],
};

/** 그룹 표시용 메타데이터 */
export const GROUP_META: Record<ConsultGroup, {
  label: string;
  emoji: string;
  /** 인라인 스타일용 hex */
  color: string;
  hexBg: string;
  hexBorder: string;
  /** Tailwind 클래스 */
  twBg: string;
  twBorder: string;
  twText: string;
}> = {
  normal:      { label: "정상",      emoji: "🟢", color: "#22c55e", hexBg: "#f0fdf4", hexBorder: "#86efac", twBg: "bg-green-50",  twBorder: "border-green-200",  twText: "text-green-700"  },
  treatment:   { label: "치료 필요", emoji: "🔴", color: "#ef4444", hexBg: "#fef2f2", hexBorder: "#fca5a5", twBg: "bg-red-50",    twBorder: "border-red-200",    twText: "text-red-700"    },
  restoration: { label: "보철/충전", emoji: "🟡", color: "#eab308", hexBg: "#fefce8", hexBorder: "#fde047", twBg: "bg-yellow-50", twBorder: "border-yellow-200", twText: "text-yellow-700" },
  missing:     { label: "결손/임플", emoji: "🟠", color: "#f97316", hexBg: "#fff7ed", hexBorder: "#fdba74", twBg: "bg-orange-50", twBorder: "border-orange-200", twText: "text-orange-700" },
  perio:       { label: "치주 관리", emoji: "🔵", color: "#3b82f6", hexBg: "#eff6ff", hexBorder: "#93c5fd", twBg: "bg-blue-50",   twBorder: "border-blue-200",   twText: "text-blue-700"   },
};

/** ToothCondition → ConsultGroup 매핑 */
export function getGroup(status: ToothCondition): ConsultGroup {
  for (const [group, conditions] of Object.entries(GROUP_CONDITIONS) as [ConsultGroup, ToothCondition[]][]) {
    if (conditions.includes(status)) return group;
  }
  return "normal";
}
