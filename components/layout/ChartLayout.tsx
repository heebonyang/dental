"use client";
import { useState } from "react";
import { usePanelTheme } from "@/lib/hooks/usePanelTheme";
import PatientExplorer  from "@/components/patient/PatientExplorer";
import ToothDiagram     from "@/components/dental-chart/ToothDiagram";
import ToothDetailPanel from "@/components/tooth-detail/ToothDetailPanel";
import CommandCenter    from "@/components/command/CommandCenter";
import AIAssistPanel    from "@/components/ai/AIAnalysisSlot";
import PanelHeader      from "@/components/ui/PanelHeader";
import ResizeHandle     from "@/components/ui/ResizeHandle";

// 패널 크기 제한 (px)
const LEFT_MIN    = 160, LEFT_MAX    = 420;
const RIGHT_MIN   = 200, RIGHT_MAX   = 480;
const COMMAND_MIN =  80, COMMAND_MAX = 520;

interface Props {
  isLayoutEditMode: boolean;
}

export default function ChartLayout({ isLayoutEditMode }: Props) {
  const { isDark: isChartDark, toggle: toggleChartTheme } = usePanelTheme("chart");

  const [leftWidth,     setLeftWidth]     = useState(220);
  const [rightWidth,    setRightWidth]    = useState(280);
  const [commandHeight, setCommandHeight] = useState(220);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ① 좌측: 환자 탐색기 */}
      <div className="overflow-hidden flex flex-col shrink-0" style={{ width: leftWidth }}>
        <PatientExplorer />
      </div>

      <ResizeHandle isEnabled={isLayoutEditMode} onDelta={(d) => setLeftWidth((p) => Math.max(LEFT_MIN, Math.min(LEFT_MAX, p + d)))} />

      {/* ② + ③ 중앙: 차팅 + 커맨드 센터 */}
      <div className={`flex flex-col overflow-hidden flex-1 min-w-0 ${isChartDark ? "bg-gray-900" : "bg-gray-100"}`}>
        <PanelHeader title="차팅 뷰" isDark={isChartDark} onToggleTheme={toggleChartTheme} />
        <div className="flex-1 overflow-auto p-4 min-h-0">
          <div className="flex gap-3 items-start">
            <div className="flex-1 min-w-0">
              <ToothDiagram />
            </div>
            <ToothDetailPanel />
          </div>
        </div>
        <ResizeHandle direction="vertical" isEnabled={isLayoutEditMode} onDelta={(d) => setCommandHeight((p) => Math.max(COMMAND_MIN, Math.min(COMMAND_MAX, p - d)))} />
        <div className="shrink-0" style={{ height: commandHeight }}>
          <CommandCenter />
        </div>
      </div>

      <ResizeHandle isEnabled={isLayoutEditMode} onDelta={(d) => setRightWidth((p) => Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, p - d)))} />

      {/* ④ 우측: AI 어시스트 패널 */}
      <div className="overflow-hidden flex flex-col shrink-0" style={{ width: rightWidth }}>
        <AIAssistPanel />
      </div>
    </div>
  );
}
