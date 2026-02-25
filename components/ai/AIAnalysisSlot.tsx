"use client";
import { usePanelTheme } from "@/lib/hooks/usePanelTheme";
import PanelHeader from "@/components/ui/PanelHeader";

/**
 * 우측 패널: AI 어시스트
 * AI 백엔드 연결 전 placeholder — lib/aiService.ts를 구현하면 활성화됩니다.
 */
export default function AIAssistPanel() {
  const { isDark, toggle } = usePanelTheme("ai");

  return (
    <div className={`flex flex-col h-full ${isDark ? "bg-gray-950" : "bg-white"}`}>
      <PanelHeader title="AI 어시스트" isDark={isDark} onToggleTheme={toggle} />
      <div className={`flex-1 p-4 overflow-y-auto ${isDark ? "bg-gray-950" : "bg-white"}`}>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          AI 백엔드를 연결하면 분석 기능을 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
