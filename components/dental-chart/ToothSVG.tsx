"use client";
import type { ToothType, ArchPosition, ToothCondition } from "@/lib/types";

// ─── ViewBox: 0 0 36 54 ─────────────────────────────────────────────────────
// Upper teeth: root at top (y≈0), crown at bottom (y≈54)
// Lower teeth: crown at top (y≈0), root at bottom (y≈54)

type Geo = { roots: string[]; crown: string; cej: number };

// ── Upper arch paths ──────────────────────────────────────────────────────────
const UPPER_GEO: Record<ToothType, Geo> = {
  incisor: {
    roots: ["M 15,26 L 14,4 Q 18,1 22,4 L 21,26 Z"],
    crown: "M 7,26 Q 6,26 6,27 L 6,51 Q 6,53 8,53 L 28,53 Q 30,53 30,51 L 30,27 Q 30,26 29,26 Z",
    cej: 26,
  },
  canine: {
    roots: ["M 15,26 L 13,3 Q 18,0 23,3 L 21,26 Z"],
    crown: "M 7,26 Q 6,26 6,27 L 6,51 Q 6,53 8,53 L 28,53 Q 30,53 30,51 L 30,27 Q 30,26 29,26 Z",
    cej: 26,
  },
  premolar: {
    roots: [
      "M 13,27 L 10,4 Q 14,1 16,4 L 16,27 Z",
      "M 20,27 L 20,4 Q 22,1 26,4 L 23,27 Z",
    ],
    crown: "M 5,27 Q 4,27 4,28 L 4,51 Q 4,53 6,53 L 30,53 Q 32,53 32,51 L 32,28 Q 32,27 31,27 Z",
    cej: 27,
  },
  molar: {
    roots: [
      "M 8,27 L 5,3 Q 9,0 12,3 L 13,27 Z",
      "M 17,27 L 16,2 Q 18,0 20,2 L 21,27 Z",
      "M 24,27 L 24,3 Q 27,0 31,3 L 28,27 Z",
    ],
    crown: "M 2,27 Q 1,27 1,28 L 1,51 Q 1,53 3,53 L 33,53 Q 35,53 35,51 L 35,28 Q 35,27 34,27 Z",
    cej: 27,
  },
};

// ── Lower arch paths ──────────────────────────────────────────────────────────
const LOWER_GEO: Record<ToothType, Geo> = {
  incisor: {
    crown: "M 7,1 Q 6,1 6,2 L 6,28 L 30,28 L 30,2 Q 30,1 29,1 Z",
    roots: ["M 15,28 L 14,50 Q 18,54 22,50 L 21,28 Z"],
    cej: 28,
  },
  canine: {
    crown: "M 7,1 Q 6,1 6,2 L 6,28 L 30,28 L 30,2 Q 30,1 29,1 Z",
    roots: ["M 15,28 L 13,51 Q 18,55 23,51 L 21,28 Z"],
    cej: 28,
  },
  premolar: {
    crown: "M 5,1 Q 4,1 4,2 L 4,27 L 32,27 L 32,2 Q 32,1 31,1 Z",
    roots: [
      "M 13,27 L 10,50 Q 14,54 16,50 L 16,27 Z",
      "M 20,27 L 20,50 Q 22,54 26,50 L 23,27 Z",
    ],
    cej: 27,
  },
  molar: {
    crown: "M 2,1 Q 1,1 1,2 L 1,27 L 35,27 L 35,2 Q 35,1 34,1 Z",
    roots: [
      "M 9,27 L 6,51 Q 10,55 14,51 L 14,27 Z",
      "M 22,27 L 22,51 Q 24,55 28,51 L 27,27 Z",
    ],
    cej: 27,
  },
};

// ─── Crown fill colors ────────────────────────────────────────────────────────
const CROWN_FILL: Partial<Record<ToothCondition, string>> = {
  healthy:               "#f9f5ee",
  caries:                "#f9f5ee",
  filling_composite:     "#bfdbfe",
  filling_amalgam:       "#6b7280",
  filling_glass_ionomer: "#a5f3fc",
  crown_pfc:             "#fef08a",
  crown_full_ceramic:    "#fefce8",
  crown_gold:            "#fbbf24",
  crown_temporary:       "#fdba74",
  root_canal:            "#f9f5ee",
  fracture:              "#f9f5ee",
  crack:                 "#f9f5ee",
  periodontal_mild:      "#f9f5ee",
  periodontal_moderate:  "#f9f5ee",
  periodontal_severe:    "#f9f5ee",
  bridge_abutment:       "#e0e7ff",
  bridge_pontic:         "#e0e7ff",
  impacted:              "#fde68a",
  post_and_core:         "#d9f99d",
  sealant:               "#bae6fd",
  veneer:                "#f0abfc",
  watch:                 "#f9f5ee",
};

const CROWN_STROKE: Partial<Record<ToothCondition, string>> = {
  caries:               "#ef4444",
  extraction_indicated: "#dc2626",
  fracture:             "#a855f7",
  crack:                "#8b5cf6",
  periodontal_mild:     "#f9a8d4",
  periodontal_moderate: "#ec4899",
  periodontal_severe:   "#e11d48",
};

// ─── Condition overlays ───────────────────────────────────────────────────────
function CariesOverlay({ geo, isUpper }: { geo: Geo; isUpper: boolean }) {
  const midY = isUpper ? (geo.cej + 52) / 2 : geo.cej / 2;
  return (
    <>
      <circle cx="13" cy={midY - 2} r="3.5" fill="#ef4444" opacity="0.55" />
      <circle cx="24" cy={midY + 3} r="2.5" fill="#ef4444" opacity="0.45" />
    </>
  );
}

function PerioOverlay({
  geo,
  isUpper,
  status,
}: {
  geo: Geo;
  isUpper: boolean;
  status: ToothCondition;
}) {
  const color =
    status === "periodontal_severe"
      ? "#fb7185"
      : status === "periodontal_moderate"
      ? "#f472b6"
      : "#fda4af";
  // Band on crown side near CEJ
  const y = isUpper ? geo.cej : geo.cej - 6;
  return (
    <rect x="2" y={y} width="32" height="6" fill={color} opacity="0.55" />
  );
}

function RootCanalOverlay({ roots }: { roots: string[] }) {
  return (
    <>
      {roots.map((d, i) => (
        <path key={i} d={d} fill="#fb923c" opacity="0.5" />
      ))}
    </>
  );
}

function CrackOverlay({ geo, isUpper }: { geo: Geo; isUpper: boolean }) {
  const yTop = isUpper ? geo.cej + 4 : 4;
  const yBot = isUpper ? 50 : geo.cej - 4;
  const cx = 18;
  return (
    <polyline
      points={`${cx - 3},${yTop} ${cx + 2},${(yTop + yBot) / 2} ${cx - 2},${yBot}`}
      fill="none"
      stroke="#a855f7"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  );
}

// ─── Missing / Extraction ─────────────────────────────────────────────────────
function MissingTooth({ status }: { status: ToothCondition }) {
  const isExtraction = status === "extraction_indicated";
  const stroke = isExtraction ? "#ef4444" : "#9ca3af";
  const dash = isExtraction ? undefined : "3,2";
  return (
    <svg viewBox="0 0 36 54" width="36" height="54" className="block">
      <rect
        x="5"
        y="5"
        width="26"
        height="44"
        rx="3"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeDasharray={dash}
      />
      <line x1="9" y1="9" x2="27" y2="45" stroke={stroke} strokeWidth="1.5" />
      <line x1="27" y1="9" x2="9" y2="45" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
}

// ─── Implant ──────────────────────────────────────────────────────────────────
function ImplantTooth({
  status,
  arch,
}: {
  status: ToothCondition;
  arch: ArchPosition;
}) {
  const isUpper = arch === "upper";
  const hasCrown = status === "implant_crown";
  const threadY = isUpper ? [4, 8, 12, 16, 20] : [32, 36, 40, 44, 48];
  const fixtureY = isUpper ? 2 : 30;
  const abutTopY = isUpper ? 24 : 26;
  const crownPath = isUpper
    ? "M 7,28 Q 6,28 6,29 L 6,51 Q 6,53 8,53 L 28,53 Q 30,53 30,51 L 30,29 Q 30,28 29,28 Z"
    : "M 7,1 Q 6,1 6,2 L 6,26 L 30,26 L 30,2 Q 30,1 29,1 Z";

  return (
    <svg viewBox="0 0 36 54" width="36" height="54" className="block">
      {/* Fixture */}
      <rect
        x="15"
        y={fixtureY}
        width="6"
        height="22"
        rx="3"
        fill="#2dd4bf"
        stroke="#0d9488"
        strokeWidth="0.8"
      />
      {threadY.map((y) => (
        <line
          key={y}
          x1="13"
          y1={y}
          x2="23"
          y2={y}
          stroke="#0d9488"
          strokeWidth="0.7"
          opacity="0.7"
        />
      ))}
      {/* Abutment */}
      <path
        d={
          isUpper
            ? "M 13,24 L 11,28 L 25,28 L 23,24 Z"
            : "M 13,30 L 11,26 L 25,26 L 23,30 Z"
        }
        fill="#14b8a6"
        stroke="#0d9488"
        strokeWidth="0.8"
      />
      {/* Crown */}
      {hasCrown ? (
        <path
          d={crownPath}
          fill="#99f6e4"
          stroke="#14b8a6"
          strokeWidth="1.2"
        />
      ) : (
        <path
          d={crownPath}
          fill="none"
          stroke="#14b8a6"
          strokeWidth="1.2"
          strokeDasharray="3,2"
        />
      )}
    </svg>
  );
}

// ─── Natural tooth ────────────────────────────────────────────────────────────
function NaturalTooth({
  toothType,
  arch,
  status,
}: {
  toothType: ToothType;
  arch: ArchPosition;
  status: ToothCondition;
}) {
  const isUpper = arch === "upper";
  const geo = isUpper ? UPPER_GEO[toothType] : LOWER_GEO[toothType];

  const crownFill = CROWN_FILL[status] ?? "#f9f5ee";
  const crownStroke = CROWN_STROKE[status] ?? "#b0a090";
  const rootFill = status === "root_canal" ? "#fde68a" : "#f0e8d0";

  return (
    <svg viewBox="0 0 36 54" width="36" height="54" className="block">
      {/* Roots */}
      {geo.roots.map((d, i) => (
        <path key={i} d={d} fill={rootFill} stroke="#c4a87a" strokeWidth="0.8" />
      ))}

      {/* Crown */}
      <path
        d={geo.crown}
        fill={crownFill}
        stroke={crownStroke}
        strokeWidth="1.2"
      />

      {/* Overlays */}
      {status === "caries" && (
        <CariesOverlay geo={geo} isUpper={isUpper} />
      )}
      {(status === "periodontal_mild" ||
        status === "periodontal_moderate" ||
        status === "periodontal_severe") && (
        <PerioOverlay geo={geo} isUpper={isUpper} status={status} />
      )}
      {status === "root_canal" && (
        <RootCanalOverlay roots={geo.roots} />
      )}
      {(status === "fracture" || status === "crack") && (
        <CrackOverlay geo={geo} isUpper={isUpper} />
      )}
    </svg>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function ToothSVG({
  toothType,
  arch,
  status,
}: {
  toothType: ToothType;
  arch: ArchPosition;
  status: ToothCondition;
}) {
  if (status === "missing" || status === "extraction_indicated") {
    return <MissingTooth status={status} />;
  }
  if (status === "implant" || status === "implant_crown") {
    return <ImplantTooth status={status} arch={arch} />;
  }
  return <NaturalTooth toothType={toothType} arch={arch} status={status} />;
}
