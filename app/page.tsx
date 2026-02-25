"use client";
import Header          from "@/components/layout/Header";
import PatientExplorer from "@/components/patient/PatientExplorer";
import ChartLegend     from "@/components/dental-chart/ChartLegend";
import ToothDiagram    from "@/components/dental-chart/ToothDiagram";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import CommandCenter   from "@/components/command/CommandCenter";
import AIAssistPanel   from "@/components/ai/AIAnalysisSlot";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      <Header />

      {/* 4-panel dashboard grid */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: "220px 1fr 280px" }}>

        {/* ① 왼쪽: 환자 탐색기 */}
        <div className="border-r border-gray-700 overflow-hidden flex flex-col">
          <PatientExplorer />
        </div>

        {/* ② + ③ 가운데: 차트 뷰 (상단) + 커맨드 센터 (하단) */}
        <div className="flex flex-col overflow-hidden bg-gray-100">
          {/* 상단: 메인 차팅 뷰 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <ChartLegend />
            <ToothDiagram />
            <ToothDetailPanel />
          </div>
          {/* 하단: 커맨드 센터 */}
          <CommandCenter />
        </div>

        {/* ④ 오른쪽: AI 어시스트 패널 */}
        <div className="border-l border-gray-700 overflow-hidden flex flex-col">
          <AIAssistPanel />
        </div>

      </div>
    </div>
  );
}
