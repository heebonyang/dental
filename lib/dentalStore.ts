import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type { ToothCondition, PatientData, DentalRecord, ConditionTool, PanelId, PanelTheme, AppView } from "./types";
import { buildTeethRecord } from "./utils";

export function newRecord(): DentalRecord {
  return {
    patient: { id: uuid(), name: "", birthDate: "", gender: "male", phone: "", chartNumbers: {}, clinic: "" },
    teeth: buildTeethRecord(),
    notes: [],
    updatedAt: new Date().toISOString(),
  };
}

interface StoreState {
  // UI (not persisted)
  selectedTooth: number | null;
  activeTool: ConditionTool;
  appView: AppView;
  // Data (persisted)
  records: DentalRecord[];
  activeRecordId: string;
  clinics: string[];
  panelThemes: Record<PanelId, PanelTheme>;
  // Patient management
  addRecord: () => void;
  setActiveRecord: (id: string) => void;
  deleteRecord: (id: string) => void;
  // Chart actions
  selectTooth: (id: number | null) => void;
  setActiveTool: (tool: ConditionTool) => void;
  setAppView: (v: AppView) => void;
  setToothStatus: (toothId: number, condition: ToothCondition) => void;
  updateToothNote: (toothId: number, note: string) => void;
  updatePatient: (patch: Partial<PatientData>) => void;
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  resetChart: () => void;
  // Clinics
  addClinic: (name: string) => void;
  deleteClinic: (name: string) => void;
  // Theme
  togglePanelTheme: (panel: PanelId) => void;
}

function patchActive(
  s: Pick<StoreState, "records" | "activeRecordId">,
  updater: (r: DentalRecord) => DentalRecord
): { records: DentalRecord[] } {
  return {
    records: s.records.map((r) =>
      r.patient.id === s.activeRecordId
        ? updater({ ...r, updatedAt: new Date().toISOString() })
        : r
    ),
  };
}

const initialRecord = newRecord();

export const useDentalStore = create<StoreState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        selectedTooth: null,
        activeTool: "select",
        appView: "chart",
        records: [initialRecord],
        activeRecordId: initialRecord.patient.id,
        clinics: [],
        panelThemes: { explorer: "dark", chart: "light", command: "dark", ai: "dark" },

        addRecord: () => {
          const r = newRecord();
          set((s) => ({ records: [...s.records, r], activeRecordId: r.patient.id, selectedTooth: null }));
        },

        setActiveRecord: (id) => set({ activeRecordId: id, selectedTooth: null }),

        deleteRecord: (id) =>
          set((s) => {
            const remaining = s.records.filter((r) => r.patient.id !== id);
            if (remaining.length === 0) {
              const r = newRecord();
              return { records: [r], activeRecordId: r.patient.id };
            }
            const newActive = s.activeRecordId === id ? remaining[0].patient.id : s.activeRecordId;
            return { records: remaining, activeRecordId: newActive };
          }),

        selectTooth: (id) => set({ selectedTooth: id }),
        setActiveTool: (tool) => set({ activeTool: tool }),
        setAppView: (v) => set({ appView: v }),

        setToothStatus: (toothId, condition) =>
          set((s) =>
            patchActive(s, (r) => ({
              ...r,
              teeth: { ...r.teeth, [toothId]: { ...r.teeth[toothId], status: condition } },
            }))
          ),

        updateToothNote: (toothId, note) =>
          set((s) =>
            patchActive(s, (r) => ({
              ...r,
              teeth: { ...r.teeth, [toothId]: { ...r.teeth[toothId], note } },
            }))
          ),

        updatePatient: (patch) =>
          set((s) =>
            patchActive(s, (r) => ({ ...r, patient: { ...r.patient, ...patch } }))
          ),

        addNote: (content) =>
          set((s) =>
            patchActive(s, (r) => ({
              ...r,
              notes: [
                ...r.notes,
                {
                  id: uuid(),
                  date: new Date().toISOString(),
                  content,
                },
              ],
            }))
          ),

        deleteNote: (id) =>
          set((s) =>
            patchActive(s, (r) => ({ ...r, notes: r.notes.filter((n) => n.id !== id) }))
          ),

        resetChart: () =>
          set((s) => ({
            ...patchActive(s, (r) => ({ ...r, teeth: buildTeethRecord(), notes: [] })),
            selectedTooth: null,
          })),

        addClinic: (name) =>
          set((s) => ({ clinics: s.clinics.includes(name) ? s.clinics : [...s.clinics, name] })),

        deleteClinic: (name) =>
          set((s) => ({ clinics: s.clinics.filter((c) => c !== name) })),

        togglePanelTheme: (panel) =>
          set((s) => ({
            panelThemes: {
              ...s.panelThemes,
              [panel]: s.panelThemes[panel] === "dark" ? "light" : "dark",
            },
          })),
      }),
      {
        name: "dental-record",
        version: 4,
        partialize: (s) => ({ records: s.records, activeRecordId: s.activeRecordId, clinics: s.clinics, panelThemes: s.panelThemes }),
        migrate: (persisted: unknown, version: number) => {
          const data = persisted as Record<string, unknown>;
          if (version < 2) {
            const record = data.record as Record<string, unknown> | undefined;
            if (record) {
              const patient = record.patient as Record<string, unknown> | undefined;
              if (patient) {
                if (typeof patient.chartNumber === "string") {
                  const clinic = (patient.clinic as string) ?? "";
                  patient.chartNumbers = clinic && patient.chartNumber ? { [clinic]: patient.chartNumber } : {};
                  delete patient.chartNumber;
                }
                if (!patient.chartNumbers) patient.chartNumbers = {};
              }
            }
          }
          if (version < 3) {
            if (data.record && !data.records) {
              const rec = data.record as DentalRecord;
              if (!rec.patient.chartNumbers) rec.patient.chartNumbers = {};
              data.records = [rec];
              data.activeRecordId = rec.patient.id;
              delete data.record;
            }
          }
          if (version < 4) {
            const recs = data.records as DentalRecord[] | undefined;
            if (recs) {
              recs.forEach((r) => {
                if ((r.patient.gender as string) === "other") r.patient.gender = "male";
              });
            }
            if (!data.panelThemes) {
              data.panelThemes = { explorer: "dark", chart: "light", command: "dark", ai: "dark" };
            }
          }
          return data;
        },
      }
    )
  )
);

export const useActiveRecord = (): DentalRecord =>
  useDentalStore(
    (s) => s.records.find((r) => r.patient.id === s.activeRecordId) ?? s.records[0]
  );
