// ──────────────────────────────────────────────────────────
// DENTAL STORE — Zustand state management
// Single source of truth for the entire charting session
// ──────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { v4 as uuid } from "uuid";
import type {
  DentalRecord,
  ToothData,
  ToothCondition,
  ToothSurface,
  ClinicalNote,
  AIAnalysisResult,
  PatientData,
  ConditionTool,
  ViewMode,
} from "./types";
import {
  buildTeethRecord,
  createDemoPatient,
  exportRecordAsJSON,
} from "./utils";
import { DEMO_SEED_CONDITIONS } from "./constants";
import { MockAIService } from "./aiService";

// ── UI state (not persisted) ───────────────────────────────
interface UIState {
  selectedToothId: number | null;
  activeTool: ConditionTool;
  viewMode: ViewMode;
  isAIAnalyzing: boolean;
  aiError: string | null;
  showJsonExport: boolean;
  highlightedToothIds: number[];
}

// ── Store shape ────────────────────────────────────────────
interface DentalStore {
  // ── Data ────────────────────────────────────────────────
  record: DentalRecord;

  // ── UI ──────────────────────────────────────────────────
  ui: UIState;

  // ── Tooth actions ────────────────────────────────────────
  selectTooth: (id: number | null) => void;
  setToothStatus: (toothId: number, condition: ToothCondition) => void;
  setToothSurface: (toothId: number, surface: ToothSurface, condition: ToothCondition | null) => void;
  updateToothNote: (toothId: number, note: string) => void;
  resetTooth: (toothId: number) => void;
  setPocketDepths: (toothId: number, depths: [number,number,number,number,number,number]) => void;
  setMobility: (toothId: number, grade: 0 | 1 | 2 | 3) => void;

  // ── Note actions ─────────────────────────────────────────
  addNote: (content: string, author: string, linkedToothIds?: number[]) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  attachAIResult: (noteId: string, result: AIAnalysisResult) => void;

  // ── AI actions ───────────────────────────────────────────
  analyzeNote: (noteId: string) => Promise<void>;
  setAIError: (msg: string | null) => void;

  // ── UI actions ───────────────────────────────────────────
  setActiveTool: (tool: ConditionTool) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleJsonExport: () => void;
  setHighlightedTeeth: (ids: number[]) => void;

  // ── Utility ──────────────────────────────────────────────
  exportJSON: () => string;
  resetChart: () => void;
}

// ── Initial record factory ────────────────────────────────
function makeInitialRecord(): DentalRecord {
  const now = new Date().toISOString();
  return {
    patient: createDemoPatient(),
    teeth: buildTeethRecord(DEMO_SEED_CONDITIONS),
    notes: [
      {
        id: uuid(),
        date: new Date().toISOString(),
        content:
          "#14 원심면 caries 진행 중, 인접면 sensitivity 호소. #31 치주 상태 악화 — pocket depth 6-7mm, BOP 양성, 치석 다량. #32 발치 계획 수립 필요. 전반적 구강위생 불량, OHI 필요.",
        author: "Dr. 박민준",
        linkedToothIds: [14, 31, 32],
        tags: ["caries", "periodontal", "scaling"],
        aiAnalysis: null,
      },
    ],
    metadata: {
      createdAt: now,
      updatedAt: now,
      schemaVersion: "2.0.0",
    },
  };
}

// ── Store ─────────────────────────────────────────────────
export const useDentalStore = create<DentalStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        record: makeInitialRecord(),

        ui: {
          selectedToothId: null,
          activeTool: "select",
          viewMode: "chart",
          isAIAnalyzing: false,
          aiError: null,
          showJsonExport: false,
          highlightedToothIds: [],
        },

        // ── Tooth actions ──────────────────────────────────
        selectTooth: (id) =>
          set((s) => ({ ui: { ...s.ui, selectedToothId: id } })),

        setToothStatus: (toothId, condition) =>
          set((s) => {
            const now = new Date().toISOString();
            return {
              record: {
                ...s.record,
                teeth: {
                  ...s.record.teeth,
                  [toothId]: {
                    ...s.record.teeth[toothId],
                    status: condition,
                    metadata: {
                      ...s.record.teeth[toothId].metadata,
                      updatedAt: now,
                    },
                  },
                },
                metadata: { ...s.record.metadata, updatedAt: now },
              },
            };
          }),

        setToothSurface: (toothId, surface, condition) =>
          set((s) => {
            const now = new Date().toISOString();
            return {
              record: {
                ...s.record,
                teeth: {
                  ...s.record.teeth,
                  [toothId]: {
                    ...s.record.teeth[toothId],
                    surfaces: {
                      ...s.record.teeth[toothId].surfaces,
                      [surface]: condition,
                    },
                    metadata: {
                      ...s.record.teeth[toothId].metadata,
                      updatedAt: now,
                    },
                  },
                },
              },
            };
          }),

        updateToothNote: (toothId, note) =>
          set((s) => {
            const now = new Date().toISOString();
            return {
              record: {
                ...s.record,
                teeth: {
                  ...s.record.teeth,
                  [toothId]: {
                    ...s.record.teeth[toothId],
                    notes: note,
                    metadata: {
                      ...s.record.teeth[toothId].metadata,
                      updatedAt: now,
                    },
                  },
                },
              },
            };
          }),

        resetTooth: (toothId) =>
          set((s) => {
            const existing = s.record.teeth[toothId];
            const now = new Date().toISOString();
            return {
              record: {
                ...s.record,
                teeth: {
                  ...s.record.teeth,
                  [toothId]: {
                    ...existing,
                    status: "healthy",
                    surfaces: {
                      mesial: null, distal: null, occlusal: null,
                      buccal: null, lingual: null, incisal: null,
                    },
                    perio: {
                      pocketDepths: null, bleeding: null,
                      recession: null, furcation: null, mobility: null,
                    },
                    notes: "",
                    metadata: { ...existing.metadata, updatedAt: now },
                  },
                },
              },
            };
          }),

        setPocketDepths: (toothId, depths) =>
          set((s) => {
            const now = new Date().toISOString();
            return {
              record: {
                ...s.record,
                teeth: {
                  ...s.record.teeth,
                  [toothId]: {
                    ...s.record.teeth[toothId],
                    perio: {
                      ...s.record.teeth[toothId].perio,
                      pocketDepths: depths,
                    },
                    metadata: {
                      ...s.record.teeth[toothId].metadata,
                      updatedAt: now,
                    },
                  },
                },
              },
            };
          }),

        setMobility: (toothId, grade) =>
          set((s) => ({
            record: {
              ...s.record,
              teeth: {
                ...s.record.teeth,
                [toothId]: {
                  ...s.record.teeth[toothId],
                  perio: {
                    ...s.record.teeth[toothId].perio,
                    mobility: grade,
                  },
                },
              },
            },
          })),

        // ── Note actions ───────────────────────────────────
        addNote: (content, author, linkedToothIds = []) => {
          const note: ClinicalNote = {
            id: uuid(),
            date: new Date().toISOString(),
            content,
            author,
            linkedToothIds,
            tags: [],
            aiAnalysis: null,
          };
          set((s) => ({
            record: {
              ...s.record,
              notes: [note, ...s.record.notes],
              metadata: {
                ...s.record.metadata,
                updatedAt: new Date().toISOString(),
              },
            },
          }));
          return note.id;
        },

        updateNote: (noteId, content) =>
          set((s) => ({
            record: {
              ...s.record,
              notes: s.record.notes.map((n) =>
                n.id === noteId ? { ...n, content } : n
              ),
            },
          })),

        deleteNote: (noteId) =>
          set((s) => ({
            record: {
              ...s.record,
              notes: s.record.notes.filter((n) => n.id !== noteId),
            },
          })),

        attachAIResult: (noteId, result) =>
          set((s) => ({
            record: {
              ...s.record,
              notes: s.record.notes.map((n) =>
                n.id === noteId ? { ...n, aiAnalysis: result } : n
              ),
            },
          })),

        // ── AI actions ─────────────────────────────────────
        analyzeNote: async (noteId) => {
          const { record, attachAIResult } = get();
          const note = record.notes.find((n) => n.id === noteId);
          if (!note) return;

          set((s) => ({ ui: { ...s.ui, isAIAnalyzing: true, aiError: null } }));
          try {
            const result = await MockAIService.analyze({
              noteText: note.content,
              toothIds: note.linkedToothIds,
              patientContext: {
                age: new Date().getFullYear() - new Date(record.patient.birthDate).getFullYear(),
                medicalHistory: record.patient.medicalHistory,
                medications: record.patient.medications,
              },
            });
            attachAIResult(noteId, result);
            // Highlight teeth mentioned in AI result
            const ids = result.recommendedTreatments.flatMap((r) => r.linkedToothIds);
            set((s) => ({
              ui: {
                ...s.ui,
                isAIAnalyzing: false,
                highlightedToothIds: ids,
              },
            }));
          } catch (err) {
            set((s) => ({
              ui: {
                ...s.ui,
                isAIAnalyzing: false,
                aiError: err instanceof Error ? err.message : "Analysis failed",
              },
            }));
          }
        },

        setAIError: (msg) =>
          set((s) => ({ ui: { ...s.ui, aiError: msg } })),

        // ── UI actions ─────────────────────────────────────
        setActiveTool: (tool) =>
          set((s) => ({ ui: { ...s.ui, activeTool: tool } })),

        setViewMode: (mode) =>
          set((s) => ({ ui: { ...s.ui, viewMode: mode } })),

        toggleJsonExport: () =>
          set((s) => ({
            ui: { ...s.ui, showJsonExport: !s.ui.showJsonExport },
          })),

        setHighlightedTeeth: (ids) =>
          set((s) => ({ ui: { ...s.ui, highlightedToothIds: ids } })),

        // ── Utility ────────────────────────────────────────
        exportJSON: () => exportRecordAsJSON(get().record),

        resetChart: () => set({ record: makeInitialRecord() }),
      }),
      {
        name: "dental-charting-v2",
        // Only persist the data record, not ephemeral UI state
        partialize: (s) => ({ record: s.record }),
      }
    )
  )
);

// ── Derived selectors ─────────────────────────────────────
export const selectedTooth = (state: DentalStore): ToothData | null => {
  const id = state.ui.selectedToothId;
  return id ? state.record.teeth[id] : null;
};
