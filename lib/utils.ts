import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOOTH_DEFINITIONS } from "./constants";
import type { ToothData, UniversalNumber } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createDefaultTooth(def: Omit<ToothData, "status" | "note">): ToothData {
  return { ...def, status: "healthy", note: "" };
}

export function buildTeethRecord(): Record<UniversalNumber, ToothData> {
  const record = {} as Record<UniversalNumber, ToothData>;
  TOOTH_DEFINITIONS.forEach((def) => {
    record[def.id] = createDefaultTooth(def);
  });
  return record;
}
