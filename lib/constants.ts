import type {
  ToothData,
  ToothCondition,
  UniversalNumber,
} from "./types";

// ──────────────────────────────────────────────────────────
// 32-TOOTH MASTER DEFINITION TABLE
// Universal Numbering ↔ FDI ↔ clinical metadata
// ──────────────────────────────────────────────────────────

type StaticToothDef = Omit<
  ToothData,
  "status" | "surfaces" | "perio" | "notes" | "treatments" | "metadata"
>;

export const TOOTH_DEFINITIONS: StaticToothDef[] = [
  // ── Quadrant 1: Upper Right ──────────────────────────────
  { id: 1,  fdi: "18", name: "Upper Right Third Molar",   quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 2,  fdi: "17", name: "Upper Right Second Molar",  quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 3,  fdi: "16", name: "Upper Right First Molar",   quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 4,  fdi: "15", name: "Upper Right Second Premolar",quadrant: 1, arch: "upper", side: "right", type: "premolar" },
  { id: 5,  fdi: "14", name: "Upper Right First Premolar",quadrant: 1, arch: "upper", side: "right", type: "premolar" },
  { id: 6,  fdi: "13", name: "Upper Right Canine",        quadrant: 1, arch: "upper", side: "right", type: "canine"   },
  { id: 7,  fdi: "12", name: "Upper Right Lateral Incisor",quadrant: 1, arch: "upper", side: "right", type: "incisor" },
  { id: 8,  fdi: "11", name: "Upper Right Central Incisor",quadrant: 1, arch: "upper", side: "right", type: "incisor" },
  // ── Quadrant 2: Upper Left ───────────────────────────────
  { id: 9,  fdi: "21", name: "Upper Left Central Incisor",quadrant: 2, arch: "upper", side: "left",  type: "incisor"  },
  { id: 10, fdi: "22", name: "Upper Left Lateral Incisor",quadrant: 2, arch: "upper", side: "left",  type: "incisor"  },
  { id: 11, fdi: "23", name: "Upper Left Canine",         quadrant: 2, arch: "upper", side: "left",  type: "canine"   },
  { id: 12, fdi: "24", name: "Upper Left First Premolar", quadrant: 2, arch: "upper", side: "left",  type: "premolar" },
  { id: 13, fdi: "25", name: "Upper Left Second Premolar",quadrant: 2, arch: "upper", side: "left",  type: "premolar" },
  { id: 14, fdi: "26", name: "Upper Left First Molar",    quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  { id: 15, fdi: "27", name: "Upper Left Second Molar",   quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  { id: 16, fdi: "28", name: "Upper Left Third Molar",    quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  // ── Quadrant 3: Lower Left ───────────────────────────────
  { id: 17, fdi: "38", name: "Lower Left Third Molar",    quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 18, fdi: "37", name: "Lower Left Second Molar",   quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 19, fdi: "36", name: "Lower Left First Molar",    quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 20, fdi: "35", name: "Lower Left Second Premolar",quadrant: 3, arch: "lower", side: "left",  type: "premolar" },
  { id: 21, fdi: "34", name: "Lower Left First Premolar", quadrant: 3, arch: "lower", side: "left",  type: "premolar" },
  { id: 22, fdi: "33", name: "Lower Left Canine",         quadrant: 3, arch: "lower", side: "left",  type: "canine"   },
  { id: 23, fdi: "32", name: "Lower Left Lateral Incisor",quadrant: 3, arch: "lower", side: "left",  type: "incisor"  },
  { id: 24, fdi: "31", name: "Lower Left Central Incisor",quadrant: 3, arch: "lower", side: "left",  type: "incisor"  },
  // ── Quadrant 4: Lower Right ──────────────────────────────
  { id: 25, fdi: "41", name: "Lower Right Central Incisor",quadrant: 4, arch: "lower", side: "right", type: "incisor" },
  { id: 26, fdi: "42", name: "Lower Right Lateral Incisor",quadrant: 4, arch: "lower", side: "right", type: "incisor" },
  { id: 27, fdi: "43", name: "Lower Right Canine",        quadrant: 4, arch: "lower", side: "right", type: "canine"   },
  { id: 28, fdi: "44", name: "Lower Right First Premolar",quadrant: 4, arch: "lower", side: "right", type: "premolar" },
  { id: 29, fdi: "45", name: "Lower Right Second Premolar",quadrant: 4, arch: "lower", side: "right", type: "premolar"},
  { id: 30, fdi: "46", name: "Lower Right First Molar",   quadrant: 4, arch: "lower", side: "right", type: "molar"    },
  { id: 31, fdi: "47", name: "Lower Right Second Molar",  quadrant: 4, arch: "lower", side: "right", type: "molar"    },
  { id: 32, fdi: "48", name: "Lower Right Third Molar",   quadrant: 4, arch: "lower", side: "right", type: "molar"    },
];

// ──────────────────────────────────────────────────────────
// CONDITION DISPLAY METADATA
// ──────────────────────────────────────────────────────────
export interface ConditionMeta {
  label: string;
  shortLabel: string;
  color: string;          // Tailwind bg class
  textColor: string;      // Tailwind text class
  borderColor: string;
  dotColor: string;       // hex for SVG use
  icon: string;           // emoji / symbol
  description: string;
}

export const CONDITION_META: Record<ToothCondition, ConditionMeta> = {
  healthy:               { label: "Healthy",                 shortLabel: "OK",   color: "bg-emerald-50",   textColor: "text-emerald-700",  borderColor: "border-emerald-300", dotColor: "#6ee7b7", icon: "✓",  description: "No pathology detected" },
  caries:                { label: "Caries",                  shortLabel: "CA",   color: "bg-red-100",      textColor: "text-red-700",      borderColor: "border-red-400",    dotColor: "#f87171", icon: "●",  description: "Active carious lesion" },
  filling_composite:     { label: "Composite Filling",       shortLabel: "CF",   color: "bg-blue-100",     textColor: "text-blue-700",     borderColor: "border-blue-400",   dotColor: "#60a5fa", icon: "▪",  description: "Tooth-colored composite restoration" },
  filling_amalgam:       { label: "Amalgam Filling",         shortLabel: "AM",   color: "bg-slate-200",    textColor: "text-slate-700",    borderColor: "border-slate-400",  dotColor: "#94a3b8", icon: "▪",  description: "Amalgam restoration" },
  filling_glass_ionomer: { label: "Glass Ionomer Filling",   shortLabel: "GI",   color: "bg-cyan-100",     textColor: "text-cyan-700",     borderColor: "border-cyan-400",   dotColor: "#67e8f9", icon: "▪",  description: "Glass ionomer restoration" },
  crown_pfc:             { label: "PFM Crown",               shortLabel: "PFM",  color: "bg-yellow-100",   textColor: "text-yellow-700",   borderColor: "border-yellow-400", dotColor: "#fbbf24", icon: "◆",  description: "Porcelain-fused-to-metal crown" },
  crown_full_ceramic:    { label: "Full Ceramic Crown",      shortLabel: "CC",   color: "bg-amber-50",     textColor: "text-amber-700",    borderColor: "border-amber-300",  dotColor: "#fcd34d", icon: "◆",  description: "All-ceramic crown" },
  crown_gold:            { label: "Gold Crown",              shortLabel: "GC",   color: "bg-yellow-200",   textColor: "text-yellow-800",   borderColor: "border-yellow-500", dotColor: "#f59e0b", icon: "◆",  description: "Gold alloy crown" },
  crown_temporary:       { label: "Temporary Crown",         shortLabel: "TC",   color: "bg-orange-50",    textColor: "text-orange-600",   borderColor: "border-orange-300", dotColor: "#fdba74", icon: "◇",  description: "Provisional / temporary crown" },
  missing:               { label: "Missing",                 shortLabel: "MX",   color: "bg-gray-100",     textColor: "text-gray-400",     borderColor: "border-gray-300",   dotColor: "#d1d5db", icon: "✕",  description: "Tooth absent / extracted" },
  implant:               { label: "Implant",                 shortLabel: "IMP",  color: "bg-teal-100",     textColor: "text-teal-700",     borderColor: "border-teal-400",   dotColor: "#2dd4bf", icon: "⊕",  description: "Osseointegrated implant fixture" },
  implant_crown:         { label: "Implant Crown",           shortLabel: "IC",   color: "bg-teal-200",     textColor: "text-teal-800",     borderColor: "border-teal-500",   dotColor: "#14b8a6", icon: "⊕",  description: "Implant-supported crown" },
  root_canal:            { label: "Root Canal Treatment",    shortLabel: "RCT",  color: "bg-orange-100",   textColor: "text-orange-700",   borderColor: "border-orange-400", dotColor: "#fb923c", icon: "⊙",  description: "Endodontically treated tooth" },
  fracture:              { label: "Fracture",                shortLabel: "FX",   color: "bg-purple-100",   textColor: "text-purple-700",   borderColor: "border-purple-400", dotColor: "#c084fc", icon: "⚡", description: "Crown or root fracture" },
  crack:                 { label: "Cracked Tooth",           shortLabel: "CK",   color: "bg-violet-100",   textColor: "text-violet-700",   borderColor: "border-violet-400", dotColor: "#a78bfa", icon: "╱",  description: "Crack line visible" },
  periodontal_mild:      { label: "Perio — Mild",            shortLabel: "P1",   color: "bg-pink-50",      textColor: "text-pink-600",     borderColor: "border-pink-300",   dotColor: "#f9a8d4", icon: "~",  description: "Mild periodontal involvement (3-4 mm pockets)" },
  periodontal_moderate:  { label: "Perio — Moderate",        shortLabel: "P2",   color: "bg-pink-100",     textColor: "text-pink-700",     borderColor: "border-pink-400",   dotColor: "#f472b6", icon: "~~", description: "Moderate periodontitis (4-6 mm pockets)" },
  periodontal_severe:    { label: "Perio — Severe",          shortLabel: "P3",   color: "bg-rose-200",     textColor: "text-rose-800",     borderColor: "border-rose-500",   dotColor: "#fb7185", icon: "~~~",description: "Severe periodontitis (>6 mm pockets)" },
  bridge_abutment:       { label: "Bridge Abutment",         shortLabel: "BA",   color: "bg-indigo-100",   textColor: "text-indigo-700",   borderColor: "border-indigo-400", dotColor: "#818cf8", icon: "⊣",  description: "Bridge abutment tooth" },
  bridge_pontic:         { label: "Bridge Pontic",           shortLabel: "BP",   color: "bg-indigo-50",    textColor: "text-indigo-600",   borderColor: "border-indigo-300", dotColor: "#a5b4fc", icon: "⊢",  description: "Bridge pontic (artificial tooth)" },
  impacted:              { label: "Impacted",                shortLabel: "IMP",  color: "bg-amber-100",    textColor: "text-amber-700",    borderColor: "border-amber-400",  dotColor: "#f59e0b", icon: "↓",  description: "Impacted tooth" },
  extraction_indicated:  { label: "Extraction Indicated",    shortLabel: "EX",   color: "bg-red-200",      textColor: "text-red-800",      borderColor: "border-red-600",    dotColor: "#ef4444", icon: "✖",  description: "Planned extraction" },
  post_and_core:         { label: "Post & Core",             shortLabel: "PC",   color: "bg-lime-100",     textColor: "text-lime-700",     borderColor: "border-lime-400",   dotColor: "#86efac", icon: "⬆",  description: "Post and core build-up" },
  sealant:               { label: "Sealant",                 shortLabel: "SE",   color: "bg-sky-50",       textColor: "text-sky-600",      borderColor: "border-sky-300",    dotColor: "#7dd3fc", icon: "○",  description: "Pit and fissure sealant" },
  veneer:                { label: "Veneer",                  shortLabel: "VN",   color: "bg-fuchsia-50",   textColor: "text-fuchsia-600",  borderColor: "border-fuchsia-300",dotColor: "#e879f9", icon: "◑",  description: "Porcelain / composite veneer" },
  watch:                 { label: "Watch / Monitor",         shortLabel: "WA",   color: "bg-stone-50",     textColor: "text-stone-600",    borderColor: "border-stone-300",  dotColor: "#a8a29e", icon: "👁", description: "Lesion under observation" },
};

// ──────────────────────────────────────────────────────────
// ARCH DISPLAY ORDER (left → right on screen)
// Upper: 1→16  |  Lower: 32→17
// ──────────────────────────────────────────────────────────
export const UPPER_ARCH_ORDER: UniversalNumber[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
export const LOWER_ARCH_ORDER: UniversalNumber[] = [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17];

/** Display label: patient-right on left, patient-left on right */
export const ARCH_LABELS = {
  upper: { left: "UR", right: "UL" },
  lower: { left: "LR", right: "LL" },
};

// ──────────────────────────────────────────────────────────
// QUICK-SELECT TOOL PALETTE
// ──────────────────────────────────────────────────────────
export const CONDITION_PALETTE: ToothCondition[] = [
  "healthy",
  "caries",
  "filling_composite",
  "filling_amalgam",
  "crown_pfc",
  "crown_full_ceramic",
  "missing",
  "implant",
  "root_canal",
  "fracture",
  "periodontal_mild",
  "periodontal_moderate",
  "periodontal_severe",
  "extraction_indicated",
  "bridge_abutment",
  "bridge_pontic",
  "sealant",
  "watch",
];

// ──────────────────────────────────────────────────────────
// DEMO / SEED DATA
// ──────────────────────────────────────────────────────────
export const DEMO_SEED_CONDITIONS: Record<UniversalNumber, ToothCondition> = {
  1:  "missing",
  2:  "healthy",
  3:  "crown_pfc",
  4:  "filling_composite",
  5:  "healthy",
  6:  "healthy",
  7:  "veneer",
  8:  "veneer",
  9:  "veneer",
  10: "veneer",
  11: "healthy",
  12: "healthy",
  13: "caries",
  14: "root_canal",
  15: "crown_full_ceramic",
  16: "missing",
  17: "impacted",
  18: "healthy",
  19: "implant_crown",
  20: "filling_amalgam",
  21: "healthy",
  22: "healthy",
  23: "healthy",
  24: "healthy",
  25: "healthy",
  26: "healthy",
  27: "healthy",
  28: "periodontal_mild",
  29: "filling_composite",
  30: "crown_gold",
  31: "periodontal_moderate",
  32: "extraction_indicated",
};
