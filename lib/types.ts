export type UniversalNumber = number;
export type FDICode = string;

export type ToothCondition =
  | "healthy"
  | "caries"
  | "filling_composite"
  | "filling_amalgam"
  | "filling_glass_ionomer"
  | "crown_pfc"
  | "crown_full_ceramic"
  | "crown_gold"
  | "crown_temporary"
  | "missing"
  | "implant"
  | "implant_crown"
  | "root_canal"
  | "fracture"
  | "crack"
  | "periodontal_mild"
  | "periodontal_moderate"
  | "periodontal_severe"
  | "bridge_abutment"
  | "bridge_pontic"
  | "impacted"
  | "extraction_indicated"
  | "post_and_core"
  | "sealant"
  | "veneer"
  | "watch";

export type ToothType = "molar" | "premolar" | "canine" | "incisor";
export type ArchPosition = "upper" | "lower";
export type QuadrantSide = "right" | "left";
export type Quadrant = 1 | 2 | 3 | 4;

export interface ToothData {
  id: UniversalNumber;
  fdi: FDICode;
  name: string;
  quadrant: Quadrant;
  arch: ArchPosition;
  side: QuadrantSide;
  type: ToothType;
  status: ToothCondition;
  note: string;
}

export interface PatientData {
  id: string;
  name: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  phone: string;
  /** clinic name → chart number for that clinic */
  chartNumbers: Record<string, string>;
  clinic: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  content: string;
  author: string;
  linkedToothIds: number[];
}

export interface DentalRecord {
  patient: PatientData;
  teeth: Record<UniversalNumber, ToothData>;
  notes: ClinicalNote[];
  updatedAt: string;
}

export type ViewMode = "chart" | "perio" | "history";
export type ConditionTool = ToothCondition | "select" | "eraser";
