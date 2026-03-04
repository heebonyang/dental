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
  gender: "male" | "female";
  phone: string;
  /** clinic name → chart number for that clinic */
  chartNumbers: Record<string, string>;
  clinic: string;
}

export interface ClinicalNote {
  id: string;
  date: string;
  content: string;
}

export interface DentalRecord {
  patient: PatientData;
  teeth: Record<UniversalNumber, ToothData>;
  notes: ClinicalNote[];
  updatedAt: string;
}

export type ConditionTool = ToothCondition | "select" | "eraser";

export type PanelId = "explorer" | "chart" | "command" | "ai";
export type PanelTheme = "light" | "dark";

export type AppView = "chart" | "consultation";

/** 치아 상태 하나에 대한 표시 메타데이터 */
export interface ConditionMeta {
  /** 한국어 레이블 (예: "충치") */
  label: string;
  /** 환자용 쉬운 이름 */
  patientLabel: string;
  /** Tailwind 배경색 클래스 (예: "bg-red-100") */
  color: string;
  /** 도트 색상 hex 값 */
  dotColor: string;
  /** 차트 셀에 표시할 아이콘 문자 */
  icon: string;
  /** 최저 예상 비용 (원) */
  costMin?: number;
  /** 최고 예상 비용 (원) */
  costMax?: number;
  /** 치료 우선순위 */
  priority?: "high" | "mid" | "low";
}
