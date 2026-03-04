import type { ToothType, ArchPosition, ToothCondition } from "@/lib/types";

// ─── ViewBox: 0 0 36 54 ─────────────────────────────────────────────────────
// Upper teeth: root at top (y≈0), crown at bottom (y≈54)
// Lower teeth: crown at top (y≈0), root at bottom (y≈54)

type Geo = { roots: string[]; crown: string; cej: number };

// ── Upper arch paths (root at top y≈0, crown at bottom y≈54) ─────────────────
const UPPER_GEO: Record<ToothType, Geo> = {
  incisor: {
    cej: 26,
    roots: ["M 15,26 C 14,18 14,10 18,4 C 22,10 22,18 21,26 Z"],
    crown: "M 10,26 C 8,32 8,46 8,51 Q 8,53 10,53 L 26,53 Q 28,53 28,51 C 28,46 28,32 26,26 Z",
  },
  canine: {
    cej: 26,
    roots: ["M 15,26 C 14,17 13,9 18,3 C 23,9 22,17 21,26 Z"],
    crown: "M 10,26 C 8,32 8,46 8,51 Q 8,53 10,53 L 26,53 Q 28,53 28,51 C 28,46 28,32 26,26 Z",
  },
  premolar: {
    cej: 26,
    roots: [
      "M 11,26 C 10,19 11,12 13,5 Q 14,2 16,5 C 16,12 15,19 15,26 Z",
      "M 21,26 C 21,19 20,12 20,5 Q 22,2 24,5 C 25,12 25,19 25,26 Z",
    ],
    crown: "M 5,26 C 4,32 4,44 4,51 Q 4,53 6,53 L 30,53 Q 32,53 32,51 C 32,44 32,32 31,26 Z",
  },
  molar: {
    cej: 26,
    roots: [
      "M 6,26 C 5,18 5,11 7,5 Q 9,2 11,5 C 12,11 12,18 12,26 Z",
      "M 16,26 C 16,18 17,10 18,4 Q 19,1 21,4 C 21,10 20,18 20,26 Z",
      "M 24,26 C 24,18 25,11 27,5 Q 29,2 31,5 C 31,11 31,18 30,26 Z",
    ],
    crown: "M 2,26 C 1,32 1,44 1,51 Q 1,53 3,53 L 33,53 Q 35,53 35,51 C 35,44 35,32 34,26 Z",
  },
};

// ── Lower arch paths (crown at top y≈0, root at bottom y≈54) ─────────────────
const LOWER_GEO: Record<ToothType, Geo> = {
  incisor: {
    cej: 28,
    crown: "M 10,28 C 8,22 8,10 8,3 Q 8,1 10,1 L 26,1 Q 28,1 28,3 C 28,10 28,22 26,28 Z",
    roots: ["M 15,28 C 14,36 14,44 18,50 C 22,44 22,36 21,28 Z"],
  },
  canine: {
    cej: 28,
    crown: "M 10,28 C 8,22 8,10 8,3 Q 8,1 10,1 L 26,1 Q 28,1 28,3 C 28,10 28,22 26,28 Z",
    roots: ["M 15,28 C 14,35 13,43 18,51 C 23,43 22,35 21,28 Z"],
  },
  premolar: {
    cej: 28,
    crown: "M 5,28 C 4,22 4,10 4,3 Q 4,1 6,1 L 30,1 Q 32,1 32,3 C 32,10 32,22 31,28 Z",
    roots: [
      "M 11,28 C 10,35 10,43 12,49 Q 14,52 16,49 C 16,43 16,35 15,28 Z",
      "M 21,28 C 21,35 21,43 21,49 Q 22,52 24,49 C 25,43 25,35 25,28 Z",
    ],
  },
  molar: {
    cej: 28,
    crown: "M 2,28 C 1,22 1,10 1,3 Q 1,1 3,1 L 33,1 Q 35,1 35,3 C 35,10 35,22 34,28 Z",
    roots: [
      "M 7,28 C 6,35 6,44 8,50 Q 10,53 13,50 C 14,44 14,35 13,28 Z",
      "M 23,28 C 22,35 22,44 22,50 Q 24,53 27,50 C 28,44 28,35 27,28 Z",
    ],
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
function MissingTooth({ status, width, height }: { status: ToothCondition; width: number; height: number }) {
  const isExtraction = status === "extraction_indicated";
  const stroke = isExtraction ? "#ef4444" : "#9ca3af";
  const dash = isExtraction ? undefined : "3,2";
  return (
    <svg viewBox="0 0 36 54" width={width} height={height} className="block">
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
  width,
  height,
}: {
  status: ToothCondition;
  arch: ArchPosition;
  width: number;
  height: number;
}) {
  const isUpper = arch === "upper";
  const hasCrown = status === "implant_crown";
  const threadY = isUpper ? [4, 8, 12, 16, 20] : [32, 36, 40, 44, 48];
  const fixtureY = isUpper ? 2 : 30;
  const crownPath = isUpper
    ? "M 7,28 Q 6,28 6,29 L 6,51 Q 6,53 8,53 L 28,53 Q 30,53 30,51 L 30,29 Q 30,28 29,28 Z"
    : "M 7,1 Q 6,1 6,2 L 6,26 L 30,26 L 30,2 Q 30,1 29,1 Z";

  return (
    <svg viewBox="0 0 36 54" width={width} height={height} className="block">
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
  width,
  height,
}: {
  toothType: ToothType;
  arch: ArchPosition;
  status: ToothCondition;
  width: number;
  height: number;
}) {
  const isUpper = arch === "upper";
  const geo = isUpper ? UPPER_GEO[toothType] : LOWER_GEO[toothType];

  const crownFill = CROWN_FILL[status] ?? "#f9f5ee";
  const crownStroke = CROWN_STROKE[status] ?? "#b0a090";
  const rootFill = status === "root_canal" ? "#fde68a" : "#f0e8d0";

  return (
    <svg viewBox="0 0 36 54" width={width} height={height} className="block">
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
  width = 36,
  height = 54,
}: {
  toothType: ToothType;
  arch: ArchPosition;
  status: ToothCondition;
  width?: number;
  height?: number;
}) {
  if (status === "missing" || status === "extraction_indicated") {
    return <MissingTooth status={status} width={width} height={height} />;
  }
  if (status === "implant" || status === "implant_crown") {
    return <ImplantTooth status={status} arch={arch} width={width} height={height} />;
  }
  return <NaturalTooth toothType={toothType} arch={arch} status={status} width={width} height={height} />;
}
