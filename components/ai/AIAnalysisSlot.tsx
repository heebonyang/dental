"use client";
import { useDentalStore } from "@/lib/dentalStore";

export default function AIAssistPanel() {
  const panelThemes      = useDentalStore((s) => s.panelThemes);
  const togglePanelTheme = useDentalStore((s) => s.togglePanelTheme);

  const dark = panelThemes.ai === "dark";

  return (
    <div className={`flex flex-col h-full ${dark ? "bg-gray-950" : "bg-white"}`}>
      <div className={`px-3 py-2 shrink-0 flex items-center justify-between ${dark ? "bg-gray-900" : "bg-gray-50 border-b border-gray-200"}`}>
        <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-gray-400" : "text-gray-500"}`}>
          AI 어시스트
        </span>
        <button
          onClick={() => togglePanelTheme("ai")}
          title={dark ? "라이트 모드" : "다크 모드"}
          className={`text-xs ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`}
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>
      <div className={`flex-1 p-4 overflow-y-auto ${dark ? "bg-gray-950" : "bg-white"}`}>
        <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
          AI 백엔드를 연결하면 분석 기능을 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
