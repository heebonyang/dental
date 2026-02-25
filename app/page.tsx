"use client";
import Header          from "@/components/layout/Header";
import PatientExplorer from "@/components/patient/PatientExplorer";
import ChartLegend     from "@/components/dental-chart/ChartLegend";
import ToothDiagram    from "@/components/dental-chart/ToothDiagram";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import CommandCenter   from "@/components/command/CommandCenter";
import AIAssistPanel   from "@/components/ai/AIAnalysisSlot";
import PanelHeader     from "@/components/ui/PanelHeader";
import { usePanelTheme } from "@/lib/hooks/usePanelTheme";

export default function Home() {
  const { isDark: isChartDark, toggle: toggleChartTheme } = usePanelTheme("chart");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      <Header />

      {/* 4분할 대시보드 그리드 */}
      <div className="flex-1 grid overflow-hidden" style={{ gridTemplateColumns: "220px 1fr 280px" }}>

        {/* ① 좌측: 환자 탐색기 */}
        <div className="border-r border-gray-700 overflow-hidden flex flex-col">
          <PatientExplorer />
        </div>

        {/* ② 중앙 상단: 차팅 뷰  ③ 중앙 하단: 커맨드 센터 */}
        <div className={`flex flex-col overflow-hidden ${isChartDark ? "bg-gray-900" : "bg-gray-100"}`}>
          <PanelHeader title="차팅 뷰" isDark={isChartDark} onToggleTheme={toggleChartTheme} />
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <ChartLegend />
            <ToothDiagram />
            <ToothDetailPanel />
          </div>
          <CommandCenter />
        </div>

        {/* ④ 우측: AI 어시스트 패널 */}
        <div className="border-l border-gray-700 overflow-hidden flex flex-col">
          <AIAssistPanel />
        </div>

      </div>
    </div>
  );
}
