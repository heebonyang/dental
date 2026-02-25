import type { ToothData, ToothCondition, UniversalNumber } from "./types";

type StaticToothDef = Omit<ToothData, "status" | "note">;

export const TOOTH_DEFINITIONS: StaticToothDef[] = [
  // Quadrant 1: Upper Right
  { id: 1,  fdi: "18", name: "Upper Right Third Molar",    quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 2,  fdi: "17", name: "Upper Right Second Molar",   quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 3,  fdi: "16", name: "Upper Right First Molar",    quadrant: 1, arch: "upper", side: "right", type: "molar"    },
  { id: 4,  fdi: "15", name: "Upper Right Second Premolar",quadrant: 1, arch: "upper", side: "right", type: "premolar" },
  { id: 5,  fdi: "14", name: "Upper Right First Premolar", quadrant: 1, arch: "upper", side: "right", type: "premolar" },
  { id: 6,  fdi: "13", name: "Upper Right Canine",         quadrant: 1, arch: "upper", side: "right", type: "canine"   },
  { id: 7,  fdi: "12", name: "Upper Right Lateral Incisor",quadrant: 1, arch: "upper", side: "right", type: "incisor"  },
  { id: 8,  fdi: "11", name: "Upper Right Central Incisor",quadrant: 1, arch: "upper", side: "right", type: "incisor"  },
  // Quadrant 2: Upper Left
  { id: 9,  fdi: "21", name: "Upper Left Central Incisor", quadrant: 2, arch: "upper", side: "left",  type: "incisor"  },
  { id: 10, fdi: "22", name: "Upper Left Lateral Incisor", quadrant: 2, arch: "upper", side: "left",  type: "incisor"  },
  { id: 11, fdi: "23", name: "Upper Left Canine",          quadrant: 2, arch: "upper", side: "left",  type: "canine"   },
  { id: 12, fdi: "24", name: "Upper Left First Premolar",  quadrant: 2, arch: "upper", side: "left",  type: "premolar" },
  { id: 13, fdi: "25", name: "Upper Left Second Premolar", quadrant: 2, arch: "upper", side: "left",  type: "premolar" },
  { id: 14, fdi: "26", name: "Upper Left First Molar",     quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  { id: 15, fdi: "27", name: "Upper Left Second Molar",    quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  { id: 16, fdi: "28", name: "Upper Left Third Molar",     quadrant: 2, arch: "upper", side: "left",  type: "molar"    },
  // Quadrant 3: Lower Left
  { id: 17, fdi: "38", name: "Lower Left Third Molar",     quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 18, fdi: "37", name: "Lower Left Second Molar",    quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 19, fdi: "36", name: "Lower Left First Molar",     quadrant: 3, arch: "lower", side: "left",  type: "molar"    },
  { id: 20, fdi: "35", name: "Lower Left Second Premolar", quadrant: 3, arch: "lower", side: "left",  type: "premolar" },
  { id: 21, fdi: "34", name: "Lower Left First Premolar",  quadrant: 3, arch: "lower", side: "left",  type: "premolar" },
  { id: 22, fdi: "33", name: "Lower Left Canine",          quadrant: 3, arch: "lower", side: "left",  type: "canine"   },
  { id: 23, fdi: "32", name: "Lower Left Lateral Incisor", quadrant: 3, arch: "lower", side: "left",  type: "incisor"  },
  { id: 24, fdi: "31", name: "Lower Left Central Incisor", quadrant: 3, arch: "lower", side: "left",  type: "incisor"  },
  // Quadrant 4: Lower Right
  { id: 25, fdi: "41", name: "Lower Right Central Incisor",quadrant: 4, arch: "lower", side: "right", type: "incisor"  },
  { id: 26, fdi: "42", name: "Lower Right Lateral Incisor",quadrant: 4, arch: "lower", side: "right", type: "incisor"  },
  { id: 27, fdi: "43", name: "Lower Right Canine",         quadrant: 4, arch: "lower", side: "right", type: "canine"   },
  { id: 28, fdi: "44", name: "Lower Right First Premolar", quadrant: 4, arch: "lower", side: "right", type: "premolar" },
  { id: 29, fdi: "45", name: "Lower Right Second Premolar",quadrant: 4, arch: "lower", side: "right", type: "premolar" },
  { id: 30, fdi: "46", name: "Lower Right First Molar",    quadrant: 4, arch: "lower", side: "right", type: "molar"    },
  { id: 31, fdi: "47", name: "Lower Right Second Molar",   quadrant: 4, arch: "lower", side: "right", type: "molar"    },
  { id: 32, fdi: "48", name: "Lower Right Third Molar",    quadrant: 4, arch: "lower", side: "right", type: "molar"    },
];

export interface ConditionMeta {
  label: string;
  color: string;     // Tailwind bg class
  dotColor: string;  // hex (for SVG / canvas use)
  icon: string;
}

export const CONDITION_META: Record<ToothCondition, ConditionMeta> = {
  healthy:               { label: "Healthy",              color: "bg-emerald-50",  dotColor: "#6ee7b7", icon: "✓"  },
  caries:                { label: "Caries",               color: "bg-red-100",     dotColor: "#f87171", icon: "●"  },
  filling_composite:     { label: "Composite",            color: "bg-blue-100",    dotColor: "#60a5fa", icon: "▪"  },
  filling_amalgam:       { label: "Amalgam",              color: "bg-slate-200",   dotColor: "#94a3b8", icon: "▪"  },
  filling_glass_ionomer: { label: "Glass Ionomer",        color: "bg-cyan-100",    dotColor: "#67e8f9", icon: "▪"  },
  crown_pfc:             { label: "PFM Crown",            color: "bg-yellow-100",  dotColor: "#fbbf24", icon: "◆"  },
  crown_full_ceramic:    { label: "Ceramic Crown",        color: "bg-amber-50",    dotColor: "#fcd34d", icon: "◆"  },
  crown_gold:            { label: "Gold Crown",           color: "bg-yellow-200",  dotColor: "#f59e0b", icon: "◆"  },
  crown_temporary:       { label: "Temp Crown",           color: "bg-orange-50",   dotColor: "#fdba74", icon: "◇"  },
  missing:               { label: "Missing",              color: "bg-gray-100",    dotColor: "#d1d5db", icon: "✕"  },
  implant:               { label: "Implant",              color: "bg-teal-100",    dotColor: "#2dd4bf", icon: "⊕"  },
  implant_crown:         { label: "Implant Crown",        color: "bg-teal-200",    dotColor: "#14b8a6", icon: "⊕"  },
  root_canal:            { label: "RCT",                  color: "bg-orange-100",  dotColor: "#fb923c", icon: "⊙"  },
  fracture:              { label: "Fracture",             color: "bg-purple-100",  dotColor: "#c084fc", icon: "⚡" },
  crack:                 { label: "Crack",                color: "bg-violet-100",  dotColor: "#a78bfa", icon: "╱"  },
  periodontal_mild:      { label: "Perio (Mild)",         color: "bg-pink-50",     dotColor: "#f9a8d4", icon: "~"  },
  periodontal_moderate:  { label: "Perio (Mod)",          color: "bg-pink-100",    dotColor: "#f472b6", icon: "~~" },
  periodontal_severe:    { label: "Perio (Sev)",          color: "bg-rose-200",    dotColor: "#fb7185", icon: "~~~"},
  bridge_abutment:       { label: "Bridge Abut.",         color: "bg-indigo-100",  dotColor: "#818cf8", icon: "⊣"  },
  bridge_pontic:         { label: "Bridge Pontic",        color: "bg-indigo-50",   dotColor: "#a5b4fc", icon: "⊢"  },
  impacted:              { label: "Impacted",             color: "bg-amber-100",   dotColor: "#f59e0b", icon: "↓"  },
  extraction_indicated:  { label: "Extraction",           color: "bg-red-200",     dotColor: "#ef4444", icon: "✖"  },
  post_and_core:         { label: "Post & Core",          color: "bg-lime-100",    dotColor: "#86efac", icon: "⬆"  },
  sealant:               { label: "Sealant",              color: "bg-sky-50",      dotColor: "#7dd3fc", icon: "○"  },
  veneer:                { label: "Veneer",               color: "bg-fuchsia-50",  dotColor: "#e879f9", icon: "◑"  },
  watch:                 { label: "Watch",                color: "bg-stone-50",    dotColor: "#a8a29e", icon: "👁" },
};

export const UPPER_ARCH_ORDER: UniversalNumber[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
export const LOWER_ARCH_ORDER: UniversalNumber[] = [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17];

// Quick-select palette — customise as needed
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

import type { ConditionTool } from "./types";
