import type { ToothData, ToothCondition, UniversalNumber, ConditionTool, ConditionMeta } from "./types";

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
  // 5사분면: 상악 우측 유치
  { id: 33, fdi: "55", name: "상악 우측 유치 제2유구치", quadrant: 5, arch: "upper", side: "right", type: "molar"   },
  { id: 34, fdi: "54", name: "상악 우측 유치 제1유구치", quadrant: 5, arch: "upper", side: "right", type: "molar"   },
  { id: 35, fdi: "53", name: "상악 우측 유치 견치",      quadrant: 5, arch: "upper", side: "right", type: "canine"  },
  { id: 36, fdi: "52", name: "상악 우측 유치 측절치",    quadrant: 5, arch: "upper", side: "right", type: "incisor" },
  { id: 37, fdi: "51", name: "상악 우측 유치 중절치",    quadrant: 5, arch: "upper", side: "right", type: "incisor" },
  // 6사분면: 상악 좌측 유치
  { id: 38, fdi: "61", name: "상악 좌측 유치 중절치",    quadrant: 6, arch: "upper", side: "left",  type: "incisor" },
  { id: 39, fdi: "62", name: "상악 좌측 유치 측절치",    quadrant: 6, arch: "upper", side: "left",  type: "incisor" },
  { id: 40, fdi: "63", name: "상악 좌측 유치 견치",      quadrant: 6, arch: "upper", side: "left",  type: "canine"  },
  { id: 41, fdi: "64", name: "상악 좌측 유치 제1유구치", quadrant: 6, arch: "upper", side: "left",  type: "molar"   },
  { id: 42, fdi: "65", name: "상악 좌측 유치 제2유구치", quadrant: 6, arch: "upper", side: "left",  type: "molar"   },
  // 7사분면: 하악 좌측 유치
  { id: 43, fdi: "75", name: "하악 좌측 유치 제2유구치", quadrant: 7, arch: "lower", side: "left",  type: "molar"   },
  { id: 44, fdi: "74", name: "하악 좌측 유치 제1유구치", quadrant: 7, arch: "lower", side: "left",  type: "molar"   },
  { id: 45, fdi: "73", name: "하악 좌측 유치 견치",      quadrant: 7, arch: "lower", side: "left",  type: "canine"  },
  { id: 46, fdi: "72", name: "하악 좌측 유치 측절치",    quadrant: 7, arch: "lower", side: "left",  type: "incisor" },
  { id: 47, fdi: "71", name: "하악 좌측 유치 중절치",    quadrant: 7, arch: "lower", side: "left",  type: "incisor" },
  // 8사분면: 하악 우측 유치
  { id: 48, fdi: "81", name: "하악 우측 유치 중절치",    quadrant: 8, arch: "lower", side: "right", type: "incisor" },
  { id: 49, fdi: "82", name: "하악 우측 유치 측절치",    quadrant: 8, arch: "lower", side: "right", type: "incisor" },
  { id: 50, fdi: "83", name: "하악 우측 유치 견치",      quadrant: 8, arch: "lower", side: "right", type: "canine"  },
  { id: 51, fdi: "84", name: "하악 우측 유치 제1유구치", quadrant: 8, arch: "lower", side: "right", type: "molar"   },
  { id: 52, fdi: "85", name: "하악 우측 유치 제2유구치", quadrant: 8, arch: "lower", side: "right", type: "molar"   },
];

export const CONDITION_META: Record<ToothCondition, ConditionMeta> = {
  healthy:               { label: "정상",            patientLabel: "건강한 치아",       color: "bg-emerald-50",  dotColor: "#6ee7b7", icon: "✓"                                                         },
  caries:                { label: "충치",            patientLabel: "충치",              color: "bg-red-100",     dotColor: "#f87171", icon: "●",  costMin:  50000, costMax: 150000, priority: "high" },
  filling_composite:     { label: "레진 충전",       patientLabel: "레진 충전 (완료)",  color: "bg-blue-100",    dotColor: "#60a5fa", icon: "▪",  costMin:  50000, costMax: 150000, priority: "mid"  },
  filling_amalgam:       { label: "아말감 충전",     patientLabel: "아말감 충전 (완료)",color: "bg-slate-200",   dotColor: "#94a3b8", icon: "▪",  costMin:  30000, costMax:  80000, priority: "mid"  },
  filling_glass_ionomer: { label: "GI 충전",         patientLabel: "GI 충전 (완료)",    color: "bg-cyan-100",    dotColor: "#67e8f9", icon: "▪",  costMin:  30000, costMax:  80000, priority: "mid"  },
  crown_pfc:             { label: "PFM 크라운",      patientLabel: "도자기 금속 크라운",color: "bg-yellow-100",  dotColor: "#fbbf24", icon: "◆",  costMin: 500000, costMax: 700000, priority: "mid"  },
  crown_full_ceramic:    { label: "세라믹 크라운",   patientLabel: "전도자기 크라운",   color: "bg-amber-50",    dotColor: "#fcd34d", icon: "◆",  costMin: 600000, costMax:1200000, priority: "mid"  },
  crown_gold:            { label: "골드 크라운",     patientLabel: "골드 크라운",       color: "bg-yellow-200",  dotColor: "#f59e0b", icon: "◆",  costMin: 700000, costMax:1000000, priority: "mid"  },
  crown_temporary:       { label: "임시 크라운",     patientLabel: "임시 크라운",       color: "bg-orange-50",   dotColor: "#fdba74", icon: "◇",  costMin:  50000, costMax: 100000, priority: "mid"  },
  missing:               { label: "결손",            patientLabel: "빠진 치아",         color: "bg-gray-100",    dotColor: "#d1d5db", icon: "✕",                                   priority: "mid"  },
  implant:               { label: "임플란트",        patientLabel: "임플란트",          color: "bg-teal-100",    dotColor: "#2dd4bf", icon: "⊕",  costMin:1200000, costMax:2000000, priority: "mid"  },
  implant_crown:         { label: "임플란트 크라운", patientLabel: "임플란트 크라운",   color: "bg-teal-200",    dotColor: "#14b8a6", icon: "⊕",  costMin: 400000, costMax: 800000, priority: "mid"  },
  root_canal:            { label: "신경치료",        patientLabel: "신경치료",          color: "bg-orange-100",  dotColor: "#fb923c", icon: "⊙",  costMin: 300000, costMax: 600000, priority: "high" },
  fracture:              { label: "파절",            patientLabel: "치아 파절",         color: "bg-purple-100",  dotColor: "#c084fc", icon: "⚡",  costMin: 200000, costMax: 800000, priority: "high" },
  crack:                 { label: "균열",            patientLabel: "치아 균열",         color: "bg-violet-100",  dotColor: "#a78bfa", icon: "╱",  costMin: 200000, costMax: 500000, priority: "high" },
  periodontal_mild:      { label: "치주염 (경도)",   patientLabel: "잇몸병 (경증)",     color: "bg-pink-50",     dotColor: "#f9a8d4", icon: "~",  costMin:  50000, costMax: 150000, priority: "mid"  },
  periodontal_moderate:  { label: "치주염 (중등도)", patientLabel: "잇몸병 (중등도)",   color: "bg-pink-100",    dotColor: "#f472b6", icon: "~~", costMin: 100000, costMax: 300000, priority: "mid"  },
  periodontal_severe:    { label: "치주염 (중증)",   patientLabel: "잇몸병 (중증)",     color: "bg-rose-200",    dotColor: "#fb7185", icon: "~~~",costMin: 200000, costMax: 500000, priority: "high" },
  bridge_abutment:       { label: "브릿지 지대치",   patientLabel: "브릿지 지대치",     color: "bg-indigo-100",  dotColor: "#818cf8", icon: "⊣",  costMin: 500000, costMax: 700000, priority: "mid"  },
  bridge_pontic:         { label: "브릿지 가공치",   patientLabel: "브릿지 (빠진 치아 대체)",color: "bg-indigo-50", dotColor: "#a5b4fc", icon: "⊢", costMin: 300000, costMax: 500000, priority: "mid"  },
  impacted:              { label: "매복치",          patientLabel: "묻혀있는 치아",     color: "bg-amber-100",   dotColor: "#f59e0b", icon: "↓",  costMin: 100000, costMax: 300000, priority: "mid"  },
  extraction_indicated:  { label: "발치 예정",       patientLabel: "발치 필요",         color: "bg-red-200",     dotColor: "#ef4444", icon: "✖",  costMin:  50000, costMax: 200000, priority: "high" },
  post_and_core:         { label: "포스트 코어",     patientLabel: "포스트 코어",       color: "bg-lime-100",    dotColor: "#86efac", icon: "⬆",  costMin: 150000, costMax: 300000, priority: "mid"  },
  sealant:               { label: "실란트",          patientLabel: "충치 예방 실란트",  color: "bg-sky-50",      dotColor: "#7dd3fc", icon: "○",  costMin:  20000, costMax:  50000, priority: "low"  },
  veneer:                { label: "비니어",          patientLabel: "라미네이트 비니어", color: "bg-fuchsia-50",  dotColor: "#e879f9", icon: "◑",  costMin: 400000, costMax: 800000, priority: "low"  },
  watch:                 { label: "경과 관찰",       patientLabel: "경과 관찰 중",      color: "bg-stone-50",    dotColor: "#a8a29e", icon: "👁",                                  priority: "low"  },
};

export const UPPER_ARCH_ORDER: UniversalNumber[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
export const LOWER_ARCH_ORDER: UniversalNumber[] = [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17];
// 유치 (deciduous) — 영구치 3칸 안쪽부터 5칸씩
export const UPPER_DECIDUOUS_ORDER: UniversalNumber[] = [33,34,35,36,37,38,39,40,41,42];
export const LOWER_DECIDUOUS_ORDER: UniversalNumber[] = [52,51,50,49,48,47,46,45,44,43];

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
