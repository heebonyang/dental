import { cn } from "@/lib/utils";
import { CONDITION_META } from "@/lib/constants";
import type { ToothData, ToothCondition } from "@/lib/types";
import ToothSVG from "./ToothSVG";

interface Props {
  tooth: ToothData;
  isSelected: boolean;
  onClick: () => void;
}

// 상태별 단축 레이블 (healthy 제외)
const STATUS_BADGE: Partial<Record<ToothCondition, string>> = {
  caries:                "우식",
  filling_composite:     "레진",
  filling_amalgam:       "아말",
  filling_glass_ionomer: "GI",
  crown_pfc:             "PFM",
  crown_full_ceramic:    "세라",
  crown_gold:            "골드",
  crown_temporary:       "임시",
  missing:               "결손",
  implant:               "임플",
  implant_crown:         "임플",
  root_canal:            "신경",
  fracture:              "파절",
  crack:                 "균열",
  periodontal_mild:      "P1",
  periodontal_moderate:  "P2",
  periodontal_severe:    "P3",
  bridge_abutment:       "지대",
  bridge_pontic:         "가공",
  impacted:              "매복",
  extraction_indicated:  "발치",
  post_and_core:         "포스",
  sealant:               "실란",
  veneer:                "비니",
  watch:                 "관찰",
};

export default function ToothCell({ tooth, isSelected, onClick }: Props) {
  const meta = CONDITION_META[tooth.status];
  const badge = STATUS_BADGE[tooth.status];
  const isUpper = tooth.arch === "upper";

  return (
    <button
      onClick={onClick}
      title={`${tooth.fdi} — ${tooth.name} (${meta?.label ?? ""})`}
      className={cn(
        "flex flex-col items-center gap-[2px] px-[2px] py-1 rounded transition-all focus:outline-none",
        isSelected
          ? "ring-2 ring-blue-500 bg-blue-50/80"
          : "hover:bg-gray-100"
      )}
    >
      {/* 상악: FDI 번호 위 */}
      {isUpper && (
        <span className="text-[8px] leading-none text-gray-400 font-medium tracking-tight">
          {tooth.fdi}
        </span>
      )}

      {/* SVG 치아 그림 */}
      <ToothSVG
        toothType={tooth.type}
        arch={tooth.arch}
        status={tooth.status}
      />

      {/* 상태 뱃지 */}
      {badge && (
        <span
          className="text-[7px] leading-none font-semibold px-[3px] py-[1px] rounded"
          style={{
            backgroundColor: meta?.dotColor + "33",
            color: meta?.dotColor,
          }}
        >
          {badge}
        </span>
      )}

      {/* 하악: FDI 번호 아래 */}
      {!isUpper && (
        <span className="text-[8px] leading-none text-gray-400 font-medium tracking-tight">
          {tooth.fdi}
        </span>
      )}
    </button>
  );
}
