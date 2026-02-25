"use client";
import { Header } from "@/components/layout/Header";
import { JsonViewer } from "@/components/layout/JsonViewer";
import { PatientCard } from "@/components/patient/PatientCard";
import { ToothDiagram } from "@/components/dental-chart/ToothDiagram";
import { ChartLegend } from "@/components/dental-chart/ChartLegend";
import { ToothDetailPanel } from "@/components/tooth-detail/ToothDetailPanel";
import { ClinicalNotes } from "@/components/notes/ClinicalNotes";
import { AIAnalysisSlot } from "@/components/ai/AIAnalysisSlot";
import { useDentalStore } from "@/lib/dentalStore";

export default function DentalChartPage() {
  const activeTool = useDentalStore((s) => s.ui.activeTool);
  const setActiveTool = useDentalStore((s) => s.setActiveTool);

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top navigation bar */}
      <Header />

      {/* Main 3-column layout */}
      <div className="flex flex-1 overflow-hidden gap-3 p-3">

        {/* ── LEFT PANEL (Patient + Chart + Legend) ──────── */}
        <aside className="flex flex-col gap-3 w-72 flex-shrink-0 overflow-y-auto scrollbar-thin">
          {/* Patient card */}
          <PatientCard />

          {/* Tool palette / legend */}
          <ChartLegend
            activeTool={activeTool}
            onSelectTool={setActiveTool}
          />
        </aside>

        {/* ── CENTER PANEL (Tooth Diagram + Detail + Notes) */}
        <main className="flex flex-col gap-3 flex-1 min-w-0 overflow-y-auto scrollbar-thin">
          {/* 32-tooth interactive diagram */}
          <ToothDiagram />

          {/* Tooth detail panel (shows when tooth is selected) */}
          <ToothDetailPanel />

          {/* Clinical notes */}
          <ClinicalNotes />
        </main>

        {/* ── RIGHT PANEL (AI Analysis Slot) ──────────── */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto scrollbar-thin">
          <AIAnalysisSlot />
        </aside>

      </div>

      {/* JSON viewer overlay */}
      <JsonViewer />
    </div>
  );
}
