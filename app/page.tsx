"use client";
import { useState } from "react";
import { useDentalStore } from "@/lib/dentalStore";
import Header          from "@/components/layout/Header";
import PatientExplorer from "@/components/patient/PatientExplorer";
import ChartLegend     from "@/components/dental-chart/ChartLegend";
import ToothDiagram    from "@/components/dental-chart/ToothDiagram";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import CommandCenter   from "@/components/command/CommandCenter";
import AIAssistPanel   from "@/components/ai/AIAnalysisSlot";
import PanelHeader     from "@/components/ui/PanelHeader";
import ResizeHandle    from "@/components/ui/ResizeHandle";
import ConsultationView from "@/components/consultation/ConsultationView";
import { usePanelTheme } from "@/lib/hooks/usePanelTheme";

const LEFT_MIN    = 160;
const LEFT_MAX    = 420;
const RIGHT_MIN   = 200;
const RIGHT_MAX   = 480;
const COMMAND_MIN = 80;
const COMMAND_MAX = 520;

function ChartLayout({
  isLayoutEditMode,
  onToggleLayoutEdit,
}: {
  isLayoutEditMode: boolean;
  onToggleLayoutEdit: () => void;
}) {
  const { isDark: isChartDark, toggle: toggleChartTheme } = usePanelTheme("chart");

  const [leftWidth,     setLeftWidth]     = useState(220);
  const [rightWidth,    setRightWidth]    = useState(280);
  const [commandHeight, setCommandHeight] = useState(220);

  function handleLeftResize(delta: number) {
    setLeftWidth((prev) => Math.max(LEFT_MIN, Math.min(LEFT_MAX, prev + delta)));
  }

  function handleRightResize(delta: number) {
    setRightWidth((prev) => Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, prev - delta)));
  }

  function handleCommandResize(delta: number) {
    setCommandHeight((prev) => Math.max(COMMAND_MIN, Math.min(COMMAND_MAX, prev - delta)));
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ① 좌측: 환자 탐색기 */}
      <div className="overflow-hidden flex flex-col shrink-0" style={{ width: leftWidth }}>
        <PatientExplorer />
      </div>

      <ResizeHandle isEnabled={isLayoutEditMode} onDelta={handleLeftResize} />

      {/* ② + ③ 중앙 */}
      <div className={`flex flex-col overflow-hidden flex-1 min-w-0 ${isChartDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <PanelHeader title="차팅 뷰" isDark={isChartDark} onToggleTheme={toggleChartTheme} />
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
          <ChartLegend />
          <ToothDiagram />
          <ToothDetailPanel />
        </div>
        <ResizeHandle direction="vertical" isEnabled={isLayoutEditMode} onDelta={handleCommandResize} />
        <div className="shrink-0" style={{ height: commandHeight }}>
          <CommandCenter />
        </div>
      </div>

      <ResizeHandle isEnabled={isLayoutEditMode} onDelta={handleRightResize} />

      {/* ④ 우측: AI 어시스트 패널 */}
      <div className="overflow-hidden flex flex-col shrink-0" style={{ width: rightWidth }}>
        <AIAssistPanel />
      </div>
    </div>
  );
}

export default function Home() {
  const appView = useDentalStore((s) => s.appView);
  const [isLayoutEditMode, setIsLayoutEditMode] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-950">
      <Header
        isLayoutEditMode={isLayoutEditMode}
        onToggleLayoutEdit={() => setIsLayoutEditMode((prev) => !prev)}
      />

      {appView === "chart" ? (
        <ChartLayout
          isLayoutEditMode={isLayoutEditMode}
          onToggleLayoutEdit={() => setIsLayoutEditMode((prev) => !prev)}
        />
      ) : (
        <ConsultationView />
      )}
    </div>
  );
}
