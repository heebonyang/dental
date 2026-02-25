"use client";
import Header from "@/components/layout/Header";
import PatientCard from "@/components/patient/PatientCard";
import ToothDiagram from "@/components/dental-chart/ToothDiagram";
import ChartLegend from "@/components/dental-chart/ChartLegend";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import ClinicalNotes from "@/components/notes/ClinicalNotes";
import AIAnalysisSlot from "@/components/ai/AIAnalysisSlot";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1 gap-4 p-4">
        {/* Left: Patient */}
        <aside className="w-64 shrink-0">
          <PatientCard />
        </aside>

        {/* Center: Chart + Detail + Notes */}
        <main className="flex flex-col flex-1 gap-4 min-w-0">
          <ChartLegend />
          <ToothDiagram />
          <ToothDetailPanel />
          <ClinicalNotes />
        </main>

        {/* Right: AI */}
        <aside className="w-72 shrink-0">
          <AIAnalysisSlot />
        </aside>
      </div>
    </div>
  );
}
