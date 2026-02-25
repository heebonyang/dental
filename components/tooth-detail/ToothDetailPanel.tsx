"use client";
import { useState } from "react";
import { useDentalStore, selectedTooth } from "@/lib/dentalStore";
import { CONDITION_META } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import { SurfaceMap } from "./SurfaceMap";
import { Badge } from "@/components/ui/Badge";
import { X, RotateCcw, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToothDetailPanel() {
  const tooth = useDentalStore(selectedTooth);
  const selectTooth = useDentalStore((s) => s.selectTooth);
  const updateToothNote = useDentalStore((s) => s.updateToothNote);
  const resetTooth = useDentalStore((s) => s.resetTooth);
  const setToothStatus = useDentalStore((s) => s.setToothStatus);
  const setPocketDepths = useDentalStore((s) => s.setPocketDepths);
  const setMobility = useDentalStore((s) => s.setMobility);
  const [showPerio, setShowPerio] = useState(false);
  const [pocketInput, setPocketInput] = useState("");

  if (!tooth) {
    return (
      <div className="panel p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[200px]">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Activity className="w-6 h-6 text-slate-300" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-400">선택된 치아 없음</p>
          <p className="text-xs text-slate-300 mt-0.5">
            차트에서 치아를 클릭하세요
          </p>
        </div>
      </div>
    );
  }

  const meta = CONDITION_META[tooth.status];

  const handlePocketDepthSave = () => {
    const parts = pocketInput.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (parts.length === 6) {
      setPocketDepths(
        tooth.id,
        parts as [number, number, number, number, number, number]
      );
      setPocketInput("");
    }
  };

  return (
    <div className="panel animate-fade-in">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center border-2",
              meta.color,
              meta.borderColor
            )}
          >
            <span className="text-sm">{meta.icon}</span>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              #{tooth.id} ({tooth.fdi}) — {tooth.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge
                variant={
                  tooth.status === "healthy" ? "success"
                  : tooth.status.startsWith("periodontal") ? "danger"
                  : tooth.status === "caries" ? "danger"
                  : tooth.status === "missing" ? "default"
                  : "warning"
                }
              >
                {meta.label}
              </Badge>
              <span className="text-[9px] text-slate-400">{tooth.type}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (confirm(`치아 #${tooth.id}를 초기화하시겠습니까?`)) {
                resetTooth(tooth.id);
              }
            }}
            className="btn-ghost p-1.5"
            title="초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => selectTooth(null)}
            className="btn-ghost p-1.5"
            title="닫기"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status selector */}
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">전체 상태 변경</label>
          <select
            value={tooth.status}
            onChange={(e) => setToothStatus(tooth.id, e.target.value as never)}
            className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-clinical-500"
          >
            {Object.entries(CONDITION_META).map(([cond, m]) => (
              <option key={cond} value={cond}>
                {m.icon} {m.label} ({m.shortLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Surface map */}
        <SurfaceMap tooth={tooth} />

        {/* Tooth note */}
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">
            치아별 노트
          </label>
          <textarea
            value={tooth.notes}
            onChange={(e) => updateToothNote(tooth.id, e.target.value)}
            placeholder="이 치아에 대한 임상 소견을 입력하세요..."
            rows={3}
            className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-clinical-500 resize-none"
          />
        </div>

        {/* Perio section */}
        <div>
          <button
            onClick={() => setShowPerio(!showPerio)}
            className="flex items-center justify-between w-full text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            <span>치주 측정값 (Periodontal Data)</span>
            {showPerio ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showPerio && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {/* Pocket depths display */}
              {tooth.perio.pocketDepths && (
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-[10px] text-slate-400 mb-1 uppercase tracking-wide">
                    탐침 깊이 (mm) — DB · B · MB · DL · L · ML
                  </p>
                  <div className="flex gap-1">
                    {tooth.perio.pocketDepths.map((d, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 text-center py-1 rounded text-xs font-bold border",
                          d >= 6 ? "bg-red-100 border-red-300 text-red-700"
                          : d >= 4 ? "bg-amber-100 border-amber-300 text-amber-700"
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        )}
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pocketInput}
                  onChange={(e) => setPocketInput(e.target.value)}
                  placeholder="예: 3 4 5 3 4 3 (6개 숫자)"
                  className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-clinical-500"
                />
                <button onClick={handlePocketDepthSave} className="btn-primary text-xs">
                  저장
                </button>
              </div>

              {/* Mobility */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">동요도:</span>
                {([0, 1, 2, 3] as const).map((grade) => (
                  <button
                    key={grade}
                    onClick={() => setMobility(tooth.id, grade)}
                    className={cn(
                      "w-7 h-7 rounded-md text-xs font-bold border transition-colors",
                      tooth.perio.mobility === grade
                        ? "bg-clinical-600 text-white border-clinical-600"
                        : "bg-white text-slate-600 border-slate-300 hover:border-clinical-400"
                    )}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
          <span>최종 수정: {fmtDate(tooth.metadata.updatedAt)}</span>
          <span>Quadrant {tooth.quadrant}</span>
        </div>
      </div>
    </div>
  );
}
