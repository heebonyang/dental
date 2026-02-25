import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ToothData, ToothCondition, PatientData, DentalRecord } from "./types";
import { TOOTH_DEFINITIONS } from "./constants";

/** Tailwind class merging utility */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Build a fresh default ToothData object for a given universal number */
export function createDefaultTooth(id: number): ToothData {
  const def = TOOTH_DEFINITIONS.find((t) => t.id === id);
  if (!def) throw new Error(`Unknown tooth id: ${id}`);
  const now = new Date().toISOString();

  return {
    ...def,
    status: "healthy",
    surfaces: {
      mesial: null,
      distal: null,
      occlusal: null,
      buccal: null,
      lingual: null,
      incisal: null,
    },
    perio: {
      pocketDepths: null,
      bleeding: null,
      recession: null,
      furcation: null,
      mobility: null,
    },
    notes: "",
    treatments: [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      lastExaminedAt: null,
    },
  };
}

/** Build the full 32-tooth record, seeded with a condition map */
export function buildTeethRecord(
  seedConditions?: Record<number, ToothCondition>
): Record<number, ToothData> {
  const record: Record<number, ToothData> = {};
  for (let id = 1; id <= 32; id++) {
    record[id] = createDefaultTooth(id);
    if (seedConditions?.[id]) {
      record[id].status = seedConditions[id];
    }
  }
  return record;
}

/** Create a default demo patient */
export function createDemoPatient(): PatientData {
  return {
    id: "PT-20260001",
    name: "김지수",
    birthDate: "1988-04-12",
    gender: "female",
    phone: "010-3456-7890",
    email: "jisu.kim@email.com",
    medicalHistory: ["고혈압 (Hypertension)", "당뇨 전단계 (Pre-diabetes)"],
    allergies: ["Penicillin"],
    medications: ["Amlodipine 5mg", "Aspirin 100mg"],
    lastVisit: "2025-11-20",
    nextAppointment: "2026-03-05",
    chartNumber: "C-2026-00142",
    provider: "Dr. 박민준",
  };
}

/** Format age from birth date */
export function calcAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

/** Export the entire DentalRecord as a formatted JSON blob */
export function exportRecordAsJSON(record: DentalRecord): string {
  return JSON.stringify(record, null, 2);
}

/** Count teeth by condition */
export function countByCondition(
  teeth: Record<number, ToothData>
): Record<ToothCondition, number> {
  const counts = {} as Record<ToothCondition, number>;
  Object.values(teeth).forEach((t) => {
    counts[t.status] = (counts[t.status] ?? 0) + 1;
  });
  return counts;
}

/** Urgency scoring based on chart state */
export function calcChartUrgency(teeth: Record<number, ToothData>): "low" | "medium" | "high" {
  const conditions = Object.values(teeth).map((t) => t.status);
  if (
    conditions.some((c) => c === "extraction_indicated" || c === "fracture")
  ) return "high";
  if (
    conditions.some((c) =>
      ["caries", "periodontal_severe", "root_canal", "impacted"].includes(c)
    )
  ) return "medium";
  return "low";
}

/** Format ISO date string to locale display */
export function fmtDate(iso: string | null, locale = "ko-KR"): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Shorten a pocket depth array for display */
export function fmtPocketDepths(depths: number[] | null): string {
  if (!depths) return "미측정";
  return depths.join(" | ");
}
