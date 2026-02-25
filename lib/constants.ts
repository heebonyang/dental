import type { ToothData, ToothCondition, UniversalNumber, ConditionTool } from "./types";

type StaticToothDef = Omit<ToothData, "status" | "note">;

export const TOOTH_DEFINITIONS: StaticToothDef[] = [
  // 1사분면: 상악 우측
  { id: 1,  fdi: "18", name: "상악 우측 사랑니",      quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 2,  fdi: "17", name: "상악 우측 제2대구치",    quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 3,  fdi: "16", name: "상악 우측 제1대구치",    quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 4,  fdi: "15", name: "상악 우측 제2소구치",    quadrant: 1, arch: "upper", side: "right", type: "premolar" },
  { id: 5,  fdi: "14", name: "상악 우측 제1소구치",    quadrant: 1, arch: "upper", side: "right", type: "premolar" },
  { id: 6,  fdi: "13", name: "상악 우측 견치",         quadrant: 1, arch: "upper", side: "right", type: "canine"   },
  { id: 7,  fdi: "12", name: "상악 우측 측절치",       quadrant: 1, arch: "upper", side: "right", type: "incisor"  },
  { id: 8,  fdi: "11", name: "상악 우측 중절치",       quadrant: 1, arch: "upper", side: "right", type: "incisor"  },
  // 2사분면: 상악 좌측
  { id: 9,  fdi: "21", name: "상악 좌측 중절치",       quadrant: 2, arch: "upper", side: "left",  type: "incisor"  },
  { id: 10, fdi: "22", name: "상악 좌측 측절치",       quadrant: 2, arch: "upper", side: "left",  type: "incisor"  },
  { id: 11, fdi: "23", name: "상악 좌측 견치",         quadrant: 2, arch: "upper", side: "left",  type: "canine"   },
  { id: 12, fdi: "24", name: "상악 좌측 제1소구치",    quadrant: 2, arch: "upper", side: "left",  type: "premolar" },
  { id: 13, fdi: "25", name: "상악 좌측 제2소구치",    quadrant: 2, arch: "upper", side: "left",  type: "premolar" },
  { id: 14, fdi: "26", name: "상악 좌측 제1대구치",    quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  { id: 15, fdi: "27", name: "상악 좌측 제2대구치",    quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  { id: 16, fdi: "28", name: "상악 좌측 사랑니",       quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  // 3사분면: 하악 좌측
  { id: 17, fdi: "38", name: "하악 좌측 사랑니",       quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 18, fdi: "37", name: "하악 좌측 제2대구치",    quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 19, fdi: "36", name: "하악 좌측 제1대구치",    quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 20, fdi: "35", name: "하악 좌측 제2소구치",    quadrant: 3, arch: "lower", side: "left",  type: "premolar" },
  { id: 21, fdi: "34", name: "하악 좌측 제1소구치",    quadrant: 3, arch: "lower", side: "left",  type: "premolar" },
  { id: 22, fdi: "33", name: "하악 좌측 견치",         quadrant: 3, arch: "lower", side: "left",  type: "canine"   },
  { id: 23, fdi: "32", name: "하악 좌측 측절치",       quadrant: 3, arch: "lower", side: "left",  type: "incisor"  },
  { id: 24, fdi: "31", name: "하악 좌측 중절치",       quadrant: 3, arch: "lower", side: "left",  type: "incisor"  },
  // 4사분면: 하악 우측
  { id: 25, fdi: "41", name: "하악 우측 중절치",       quadrant: 4, arch: "lower", side: "right", type: "incisor"  },
  { id: 26, fdi: "42", name: "하악 우측 측절치",       quadrant: 4, arch: "lower", side: "right", type: "incisor"  },
  { id: 27, fdi: "43", name: "하악 우측 견치",         quadrant: 4, arch: "lower", side: "right", type: "canine"   },
  { id: 28, fdi: "44", name: "하악 우측 제1소구치",    quadrant: 4, arch: "lower", side: "right", type: "premolar" },
  { id: 29, fdi: "45", name: "하악 우측 제2소구치",    quadrant: 4, arch: "lower", side: "right", type: "premolar" },
  { id: 30, fdi: "46", name: "하악 우측 제1대구치",    quadrant: 4, arch: "lower", side: "right", type: "molar"    },
  { id: 31, fdi: "47", name: "하악 우측 제2대구치",    quadrant: 4, arch: "lower", side: "right", type: "molar"    },
  { id: 32, fdi: "48", name: "하악 우측 사랑니",       quadrant: 4, arch: "lower", side: "right", type: "molar"    },
];

export interface ConditionMeta {
  label: string;
  color: string;
  dotColor: string;
  icon: string;
}

export const CONDITION_META: Record<ToothCondition, ConditionMeta> = {
  healthy:               { label: "정상",            color: "bg-emerald-50",  dotColor: "#6ee7b7", icon: "✓"   },
  caries:                { label: "충치",            color: "bg-red-100",     dotColor: "#f87171", icon: "●"   },
  filling_composite:     { label: "레진 충전",       color: "bg-blue-100",    dotColor: "#60a5fa", icon: "▪"   },
  filling_amalgam:       { label: "아말감 충전",     color: "bg-slate-200",   dotColor: "#94a3b8", icon: "▪"   },
  filling_glass_ionomer: { label: "GI 충전",         color: "bg-cyan-100",    dotColor: "#67e8f9", icon: "▪"   },
  crown_pfc:             { label: "PFM 크라운",      color: "bg-yellow-100",  dotColor: "#fbbf24", icon: "◆"   },
  crown_full_ceramic:    { label: "세라믹 크라운",   color: "bg-amber-50",    dotColor: "#fcd34d", icon: "◆"   },
  crown_gold:            { label: "골드 크라운",     color: "bg-yellow-200",  dotColor: "#f59e0b", icon: "◆"   },
  crown_temporary:       { label: "임시 크라운",     color: "bg-orange-50",   dotColor: "#fdba74", icon: "◇"   },
  missing:               { label: "결손",            color: "bg-gray-100",    dotColor: "#d1d5db", icon: "✕"   },
  implant:               { label: "임플란트",        color: "bg-teal-100",    dotColor: "#2dd4bf", icon: "⊕"   },
  implant_crown:         { label: "임플란트 크라운", color: "bg-teal-200",    dotColor: "#14b8a6", icon: "⊕"   },
  root_canal:            { label: "신경치료",        color: "bg-orange-100",  dotColor: "#fb923c", icon: "⊙"   },
  fracture:              { label: "파절",            color: "bg-purple-100",  dotColor: "#c084fc", icon: "⚡"  },
  crack:                 { label: "균열",            color: "bg-violet-100",  dotColor: "#a78bfa", icon: "╱"   },
  periodontal_mild:      { label: "치주염 (경도)",   color: "bg-pink-50",     dotColor: "#f9a8d4", icon: "~"   },
  periodontal_moderate:  { label: "치주염 (중등도)", color: "bg-pink-100",    dotColor: "#f472b6", icon: "~~"  },
  periodontal_severe:    { label: "치주염 (중증)",   color: "bg-rose-200",    dotColor: "#fb7185", icon: "~~~" },
  bridge_abutment:       { label: "브릿지 지대치",   color: "bg-indigo-100",  dotColor: "#818cf8", icon: "⊣"   },
  bridge_pontic:         { label: "브릿지 가공치",   color: "bg-indigo-50",   dotColor: "#a5b4fc", icon: "⊢"   },
  impacted:              { label: "매복치",          color: "bg-amber-100",   dotColor: "#f59e0b", icon: "↓"   },
  extraction_indicated:  { label: "발치 예정",       color: "bg-red-200",     dotColor: "#ef4444", icon: "✖"   },
  post_and_core:         { label: "포스트 코어",     color: "bg-lime-100",    dotColor: "#86efac", icon: "⬆"   },
  sealant:               { label: "실란트",          color: "bg-sky-50",      dotColor: "#7dd3fc", icon: "○"   },
  veneer:                { label: "비니어",          color: "bg-fuchsia-50",  dotColor: "#e879f9", icon: "◑"   },
  watch:                 { label: "경과 관찰",       color: "bg-stone-50",    dotColor: "#a8a29e", icon: "👁"  },
};

export const UPPER_ARCH_ORDER: UniversalNumber[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
export const LOWER_ARCH_ORDER: UniversalNumber[] = [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17];

export const CONDITION_PALETTE: ConditionTool[] = [
  "select",
  "eraser",
  "healthy",
  "caries",
  "filling_composite",
  "crown_pfc",
  "crown_full_ceramic",
  "missing",
  "implant",
  "root_canal",
  "extraction_indicated",
];
