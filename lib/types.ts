// ──────────────────────────────────────────────────────────
// DENTAL CHARTING SYSTEM — Core Type Definitions
// ──────────────────────────────────────────────────────────

/** ISO/FDI tooth numbering (11-18, 21-28, 31-38, 41-48) */
export type FDICode = string;

/** Universal Numbering System (1-32) */
export type UniversalNumber = number;

export type ToothCondition =
  | "healthy"
  | "caries"
  | "filling_composite"
  | "filling_amalgam"
  | "filling_glass_ionomer"
  | "crown_pfc"          // Porcelain-fused-to-metal
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
  | "watch";             // Monitor / recall

export type ToothSurface = "mesial" | "distal" | "occlusal" | "buccal" | "lingual" | "incisal";

export type ToothType = "molar" | "premolar" | "canine" | "incisor";
export type ArchPosition = "upper" | "lower";
export type QuadrantSide = "right" | "left";
export type Quadrant = 1 | 2 | 3 | 4;

// ── Per-surface condition map ──────────────────────────────
export type SurfaceMap = Record<ToothSurface, ToothCondition | null>;

// ── Single tooth data structure (the core JSON unit) ──────
export interface ToothData {
  /** Universal number 1-32 */
  id: UniversalNumber;
  /** FDI two-digit code e.g. "16" */
  fdi: FDICode;
  /** Human-readable name e.g. "Upper Right First Molar" */
  name: string;
  quadrant: Quadrant;
  arch: ArchPosition;
  side: QuadrantSide;
  type: ToothType;

  /** Overall / primary clinical status */
  status: ToothCondition;

  /** Per-surface conditions – null means unassessed */
  surfaces: SurfaceMap;

  /** Periodontal measurements */
  perio: {
    /** 6 pocket depth readings in mm (DB, B, MB, DL, L, ML) */
    pocketDepths: [number, number, number, number, number, number] | null;
    /** Bleeding on probing per site */
    bleeding: [boolean, boolean, boolean, boolean, boolean, boolean] | null;
    /** Gingival recession in mm */
    recession: number | null;
    /** Furcation involvement grade 0-3 */
    furcation: 0 | 1 | 2 | 3 | null;
    /** Miller mobility grade 0-3 */
    mobility: 0 | 1 | 2 | 3 | null;
  };

  /** Free-text clinical note for this tooth */
  notes: string;

  /** Treatment history records */
  treatments: TreatmentRecord[];

  metadata: {
    createdAt: string;    // ISO 8601
    updatedAt: string;
    lastExaminedAt: string | null;
  };
}

// ── Treatment history ──────────────────────────────────────
export interface TreatmentRecord {
  id: string;
  date: string;
  type: TreatmentType;
  description: string;
  provider: string;
  surfaces?: ToothSurface[];
  material?: string;
  cost?: number;
  followUpDate?: string;
}

export type TreatmentType =
  | "examination"
  | "prophylaxis"
  | "scaling"
  | "root_planing"
  | "restoration"
  | "crown"
  | "bridge"
  | "extraction"
  | "implant_placement"
  | "implant_restoration"
  | "root_canal"
  | "pulpotomy"
  | "sealant"
  | "bleaching"
  | "orthodontic"
  | "surgical"
  | "medication"
  | "other";

// ── Patient ────────────────────────────────────────────────
export interface PatientData {
  id: string;
  name: string;
  birthDate: string;       // YYYY-MM-DD
  gender: "male" | "female" | "other";
  phone: string;
  email: string;
  medicalHistory: string[];
  allergies: string[];
  medications: string[];
  lastVisit: string | null;
  nextAppointment: string | null;
  chartNumber: string;
  provider: string;
}

// ── Clinical notes ─────────────────────────────────────────
export interface ClinicalNote {
  id: string;
  date: string;
  content: string;
  author: string;
  /** Which teeth this note references */
  linkedToothIds: number[];
  tags: string[];
  /** Populated after AI analysis */
  aiAnalysis: AIAnalysisResult | null;
}

// ── AI Analysis ────────────────────────────────────────────
/**
 * AIAnalysisResult is the structured output of the AI Analysis Slot.
 * Any AI backend (Claude, GPT-4, Gemini, or a local model) should
 * return data conforming to this interface.
 */
export interface AIAnalysisResult {
  /** Extracted dental keywords from the note text */
  keywords: AIKeyword[];
  /** Suggested clinical diagnoses with confidence */
  suggestedDiagnoses: DiagnosisSuggestion[];
  /** Urgency level for the session */
  urgencyLevel: "routine" | "urgent" | "emergency";
  /** Recommended treatment actions */
  recommendedTreatments: RecommendedTreatment[];
  /** Overall confidence score 0-1 */
  confidence: number;
  /** ISO timestamp of analysis */
  analyzedAt: string;
  /** Model / version used for traceability */
  modelId: string;
  /** Raw token count for API cost tracking */
  tokenCount?: number;
}

export interface AIKeyword {
  term: string;
  /** Semantic category for colour-coding */
  category: "condition" | "treatment" | "anatomy" | "symptom" | "material" | "modifier";
  /** Relevance score 0-1 */
  relevance: number;
  /** Tooth IDs this keyword relates to (if detectable) */
  linkedToothIds: number[];
}

export interface DiagnosisSuggestion {
  diagnosis: string;
  icdCode: string | null;     // ICD-10 or ICD-DA code
  confidence: number;          // 0-1
  evidenceBasis: string[];     // Phrases from note that support this
  severity: "mild" | "moderate" | "severe";
}

export interface RecommendedTreatment {
  action: string;
  priority: "immediate" | "soon" | "elective";
  linkedToothIds: number[];
  estimatedSessions: number | null;
}

// ── API integration slot ───────────────────────────────────
/**
 * Plug any AI backend here. The system calls this interface;
 * swap implementations without touching UI components.
 */
export interface AIAnalysisService {
  name: string;
  /** Whether this service is currently configured */
  isConfigured: boolean;
  analyze(input: AIAnalysisInput): Promise<AIAnalysisResult>;
}

export interface AIAnalysisInput {
  noteText: string;
  toothIds?: number[];
  patientContext?: {
    age: number;
    medicalHistory: string[];
    medications: string[];
  };
  previousDiagnoses?: string[];
}

// ── Aggregate dental record ────────────────────────────────
export interface DentalRecord {
  patient: PatientData;
  /** The 32-tooth JSON map — the core structured data store */
  teeth: Record<UniversalNumber, ToothData>;
  notes: ClinicalNote[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    schemaVersion: string;
  };
}

// ── UI state ───────────────────────────────────────────────
export type ViewMode = "chart" | "perio" | "xray" | "history";
export type ConditionTool =
  | ToothCondition
  | "select"
  | "surface_edit"
  | "note";
