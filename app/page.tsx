"use client";
import { useState } from "react";
import Header          from "@/components/layout/Header";
import PatientExplorer from "@/components/patient/PatientExplorer";
import ChartLegend     from "@/components/dental-chart/ChartLegend";
import ToothDiagram    from "@/components/dental-chart/ToothDiagram";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import CommandCenter   from "@/components/command/CommandCenter";
import AIAssistPanel   from "@/components/ai/AIAnalysisSlot";
import PanelHeader     from "@/components/ui/PanelHeader";
import ResizeHandle    from "@/components/ui/ResizeHandle";
import { usePanelTheme } from "@/lib/hooks/usePanelTheme";

const LEFT_MIN  = 160;
const LEFT_MAX  = 420;
const RIGHT_MIN = 200;
const RIGHT_MAX = 480;

export default function Home() {
  const { isDark: isChartDark, toggle: toggleChartTheme } = usePanelTheme("chart");

  const [leftWidth,  setLeftWidth]  = useState(220);
  const [rightWidth, setRightWidth] = useState(280);

  function handleLeftResize(delta: number) {
    setLeftWidth((prev) => Math.max(LEFT_MIN, Math.min(LEFT_MAX, prev + delta)));
  }

  function handleRightResize(delta: number) {
    // 오른쪽 패널은 반대 방향: 오른쪽으로 드래그 → 패널 축소
    setRightWidth((prev) => Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, prev - delta)));
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      <Header />

      {/* 4분할 대시보드 — flex 레이아웃으로 드래그 리사이즈 */}
      <div className="flex-1 flex overflow-hidden">

        {/* ① 좌측: 환자 탐색기 */}
        <div
          className="overflow-hidden flex flex-col shrink-0"
          style={{ width: leftWidth }}
        >
          <PatientExplorer />
        </div>

        {/* 좌측 ↔ 중앙 드래그 핸들 */}
        <ResizeHandle onDelta={handleLeftResize} />

        {/* ② + ③ 중앙: 차팅 뷰 (상단) + 커맨드 센터 (하단) */}
        <div className={`flex flex-col overflow-hidden flex-1 min-w-0 ${isChartDark ? "bg-gray-900" : "bg-gray-100"}`}>
          <PanelHeader title="차팅 뷰" isDark={isChartDark} onToggleTheme={toggleChartTheme} />
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <ChartLegend />
            <ToothDiagram />
            <ToothDetailPanel />
          </div>
          <CommandCenter />
        </div>

        {/* 중앙 ↔ 우측 드래그 핸들 */}
        <ResizeHandle onDelta={handleRightResize} />

        {/* ④ 우측: AI 어시스트 패널 */}
        <div
          className="overflow-hidden flex flex-col shrink-0"
          style={{ width: rightWidth }}
        >
          <AIAssistPanel />
        </div>

      </div>
    </div>
  );
}
