"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { X, Copy, Check } from "lucide-react";
import { useState } from "react";

export function JsonViewer() {
  const show = useDentalStore((s) => s.ui.showJsonExport);
  const toggle = useDentalStore((s) => s.toggleJsonExport);
  const selectedId = useDentalStore((s) => s.ui.selectedToothId);
  const record = useDentalStore((s) => s.record);
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState<"full" | "tooth" | "patient">("tooth");

  if (!show) return null;

  const getJson = () => {
    if (view === "tooth" && selectedId) {
      return JSON.stringify(record.teeth[selectedId], null, 2);
    }
    if (view === "patient") {
      return JSON.stringify(record.patient, null, 2);
    }
    return JSON.stringify(record, null, 2);
  };

  const json = getJson();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-[700px] max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div>
            <h2 className="font-bold text-slate-800">구조화 데이터 뷰어 (JSON)</h2>
            <p className="text-xs text-slate-400">Structured Dental Record — AI 연동 데이터 포맷</p>
          </div>
          <button onClick={toggle} className="p-1.5 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 py-2 border-b bg-slate-50">
          {[
            { key: "tooth" as const, label: selectedId ? `Tooth #${selectedId}` : "선택된 치아 없음" },
            { key: "patient" as const, label: "환자 정보" },
            { key: "full" as const, label: "전체 레코드" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              disabled={tab.key === "tooth" && !selectedId}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                view === tab.key
                  ? "bg-clinical-600 text-white"
                  : "text-slate-600 hover:bg-slate-200 disabled:opacity-40"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="flex-1" />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 text-emerald-500" />복사됨</>
            ) : (
              <><Copy className="w-3.5 h-3.5" />복사</>
            )}
          </button>
        </div>

        {/* JSON content */}
        <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-slate-700 bg-slate-950 text-emerald-300 rounded-b-2xl scrollbar-thin">
          {json}
        </pre>
      </div>
    </div>
  );
}
