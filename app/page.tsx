"use client";
import Header          from "@/components/layout/Header";
import PatientExplorer from "@/components/patient/PatientExplorer";
import ChartLegend     from "@/components/dental-chart/ChartLegend";
import ToothDiagram    from "@/components/dental-chart/ToothDiagram";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import CommandCenter   from "@/components/command/CommandCenter";
import AIAssistPanel   from "@/components/ai/AIAnalysisSlot";
import { useDentalStore } from "@/lib/dentalStore";

export default function Home() {
  const panelThemes      = useDentalStore((s) => s.panelThemes);
  const togglePanelTheme = useDentalStore((s) => s.togglePanelTheme);
  const chartDark        = panelThemes.chart === "dark";

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
        <div className={`flex flex-col overflow-hidden ${chartDark ? "bg-gray-900" : "bg-gray-100"}`}>
          {/* 차팅 뷰 헤더 */}
          <div className={`px-3 py-2 flex items-center justify-between shrink-0 ${chartDark ? "bg-gray-900 border-b border-gray-700" : "bg-gray-50 border-b border-gray-200"}`}>
            <span className={`text-xs font-semibold uppercase tracking-widest ${chartDark ? "text-gray-400" : "text-gray-500"}`}>
              차팅 뷰
            </span>
            <button
              onClick={() => togglePanelTheme("chart")}
              title={chartDark ? "라이트 모드" : "다크 모드"}
              className={`text-xs ${chartDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`}
            >
              {chartDark ? "☀" : "☾"}
            </button>
          </div>
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
