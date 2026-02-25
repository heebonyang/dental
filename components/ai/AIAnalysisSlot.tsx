export default function AIAssistPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 bg-gray-900 shrink-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">AI 어시스트</span>
      </div>
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <p className="text-sm text-gray-400">
          AI 백엔드를 연결하면 분석 기능을 사용할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
