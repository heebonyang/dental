import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { ToothCondition, PatientData, DentalRecord, ViewMode, ConditionTool } from "./types";
import { buildTeethRecord } from "./utils";

function defaultRecord(): DentalRecord {
  return {
    patient: { id: uuid(), name: "", birthDate: "", gender: "other", phone: "", chartNumbers: {}, clinic: "" },
    teeth: buildTeethRecord(),
    notes: [],
    updatedAt: new Date().toISOString(),
  };
}

interface StoreState {
  // UI (not persisted)
  selectedTooth: number | null;
  activeTool: ConditionTool;
  viewMode: ViewMode;
  // Record (persisted)
  record: DentalRecord;
  // Clinic registry (persisted, shared across patients)
  clinics: string[];
  // Actions
  selectTooth: (id: number | null) => void;
  setActiveTool: (tool: ConditionTool) => void;
  setViewMode: (mode: ViewMode) => void;
  setToothStatus: (id: number, condition: ToothCondition) => void;
  updateToothNote: (id: number, note: string) => void;
  updatePatient: (patch: Partial<PatientData>) => void;
  addClinic: (name: string) => void;
  deleteClinic: (name: string) => void;
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  resetChart: () => void;
}

export const useDentalStore = create<StoreState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        selectedTooth: null,
        activeTool: "select",
        viewMode: "chart",
        record: defaultRecord(),
        clinics: [],

        selectTooth: (id) => set({ selectedTooth: id }),
        setActiveTool: (tool) => set({ activeTool: tool }),
        setViewMode: (mode) => set({ viewMode: mode }),

        setToothStatus: (id, condition) =>
          set((s) => ({
            record: {
              ...s.record,
              updatedAt: new Date().toISOString(),
              teeth: { ...s.record.teeth, [id]: { ...s.record.teeth[id], status: condition } },
            },
          })),

        updateToothNote: (id, note) =>
          set((s) => ({
            record: {
              ...s.record,
              updatedAt: new Date().toISOString(),
              teeth: { ...s.record.teeth, [id]: { ...s.record.teeth[id], note } },
            },
          })),

        updatePatient: (patch) =>
          set((s) => ({
            record: {
              ...s.record,
              updatedAt: new Date().toISOString(),
              patient: { ...s.record.patient, ...patch },
            },
          })),

        addClinic: (name) =>
          set((s) => ({
            clinics: s.clinics.includes(name) ? s.clinics : [...s.clinics, name],
          })),

        deleteClinic: (name) =>
          set((s) => ({ clinics: s.clinics.filter((c) => c !== name) })),

        addNote: (content) =>
          set((s) => ({
            record: {
              ...s.record,
              updatedAt: new Date().toISOString(),
              notes: [
                ...s.record.notes,
                {
                  id: uuid(),
                  date: new Date().toISOString(),
                  content,
                  author: "",
                  linkedToothIds: s.selectedTooth ? [s.selectedTooth] : [],
                },
              ],
            },
          })),

        deleteNote: (id) =>
          set((s) => ({
            record: {
              ...s.record,
              updatedAt: new Date().toISOString(),
              notes: s.record.notes.filter((n) => n.id !== id),
            },
          })),

        resetChart: () => set({ record: defaultRecord(), selectedTooth: null }),
      }),
      {
        name: "dental-record",
        version: 2,
        partialize: (s) => ({ record: s.record, clinics: s.clinics }),
        migrate: (persisted: unknown, version: number) => {
          const data = persisted as Record<string, unknown>;
          // v0→v2: chartNumber(string) → chartNumbers(Record)
          if (version < 2) {
            const record = data.record as Record<string, unknown> | undefined;
            if (record) {
              const patient = record.patient as Record<string, unknown> | undefined;
              if (patient && typeof patient.chartNumber === "string") {
                const clinic = (patient.clinic as string) ?? "";
                patient.chartNumbers = clinic && patient.chartNumber
                  ? { [clinic]: patient.chartNumber }
                  : {};
                delete patient.chartNumber;
              }
              if (patient && !patient.chartNumbers) {
                patient.chartNumbers = {};
              }
            }
          }
          return data;
        },
      }
    )
  )
);
