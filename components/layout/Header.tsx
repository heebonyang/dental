"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { calcAge, fmtDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Download, RefreshCw, Activity, FileJson } from "lucide-react";
import type { ViewMode } from "@/lib/types";

export function Header() {
  const patient = useDentalStore((s) => s.record.patient);
  const viewMode = useDentalStore((s) => s.ui.viewMode);
  const metadata = useDentalStore((s) => s.record.metadata);
  const setViewMode = useDentalStore((s) => s.setViewMode);
  const toggleJsonExport = useDentalStore((s) => s.toggleJsonExport);
  const resetChart = useDentalStore((s) => s.resetChart);
  const exportJSON = useDentalStore((s) => s.exportJSON);

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dental-record-${patient.chartNumber}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const views: { mode: ViewMode; label: string }[] = [
    { mode: "chart",   label: "차트" },
    { mode: "perio",   label: "치주" },
    { mode: "history", label: "기록" },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-4 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-clinical-600 flex items-center justify-center">
          <Activity className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 leading-tight">DentChart Pro</p>
          <p className="text-[9px] text-slate-400">AI-Enhanced Dental Charting</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-200" />

      {/* Patient info */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">
          {patient.name}
          <span className="text-slate-400 font-normal ml-2 text-xs">
            {calcAge(patient.birthDate)}세 · {patient.gender === "female" ? "여" : "남"}
          </span>
        </p>
        <p className="text-[10px] text-slate-400">
          {patient.chartNumber} · 담당: {patient.provider}
        </p>
      </div>

      {/* View mode tabs */}
      <nav className="flex gap-0.5 ml-4">
        {views.map((v) => (
          <button
            key={v.mode}
            onClick={() => setViewMode(v.mode)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
              viewMode === v.mode
                ? "bg-clinical-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Metadata */}
      <p className="text-[10px] text-slate-400 hidden md:block">
        최종 저장: {fmtDate(metadata.updatedAt)} · v{metadata.schemaVersion}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleJsonExport}
          className="btn-ghost"
          title="JSON 뷰어"
        >
          <FileJson className="w-4 h-4" />
          JSON
        </button>
        <button
          onClick={handleExport}
          className="btn-ghost"
          title="JSON 내보내기"
        >
          <Download className="w-4 h-4" />
          내보내기
        </button>
        <button
          onClick={() => {
            if (confirm("차트를 초기화하시겠습니까? 모든 데이터가 삭제됩니다.")) {
              resetChart();
            }
          }}
          className="btn-ghost text-red-500 hover:bg-red-50"
          title="초기화"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
