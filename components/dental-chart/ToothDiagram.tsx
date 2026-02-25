"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { UPPER_ARCH_ORDER, LOWER_ARCH_ORDER } from "@/lib/constants";
import type { ToothCondition } from "@/lib/types";
import { ToothCell } from "./ToothCell";

export function ToothDiagram() {
  const teeth = useDentalStore((s) => s.record.teeth);
  const selectedId = useDentalStore((s) => s.ui.selectedToothId);
  const highlightedIds = useDentalStore((s) => s.ui.highlightedToothIds);
  const activeTool = useDentalStore((s) => s.ui.activeTool);
  const selectTooth = useDentalStore((s) => s.selectTooth);
  const setToothStatus = useDentalStore((s) => s.setToothStatus);

  const applyTool = (id: number) => {
    if (
      activeTool !== "select" &&
      activeTool !== "surface_edit" &&
      activeTool !== "note"
    ) {
      setToothStatus(id, activeTool as ToothCondition);
    }
  };

  const renderArch = (order: number[], label: string) => (
    <div className="flex flex-col gap-1.5">
      {/* Arch label */}
      <div className="flex justify-between px-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label === "upper" ? "우측 (Right)" : "우측 (Right)"}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {label === "upper" ? "좌측 (Left)" : "좌측 (Left)"}
        </span>
      </div>

      {/* Tooth row */}
      <div className="flex items-center gap-1 justify-center flex-wrap">
        {/* Midline separator logic */}
        {order.map((id, idx) => (
          <div key={id} className="flex items-center gap-1">
            <ToothCell
              tooth={teeth[id]}
              isSelected={selectedId === id}
              isHighlighted={highlightedIds.includes(id)}
              activeTool={activeTool}
              onSelect={selectTooth}
              onApplyTool={applyTool}
            />
            {/* Midline marker */}
            {idx === 7 && (
              <div className="w-px h-10 bg-slate-300 mx-0.5 rounded-full" />
            )}
          </div>
        ))}
      </div>

      {/* Tooth number strip */}
      <div className="flex gap-1 justify-center">
        {order.map((id, idx) => (
          <div key={id} className="flex items-center gap-1">
            <span className="w-12 text-center text-[8px] text-slate-300">
              {teeth[id].fdi}
            </span>
            {idx === 7 && <div className="w-px mx-0.5" />}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="panel p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="panel-title">치아 차트 (Dental Chart)</h2>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-clinical-500 inline-block" />
          Universal Numbering System (FDI)
        </div>
      </div>

      {/* Arch labels row */}
      <div className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
        상악 (Maxillary / Upper Arch)
      </div>

      {/* Upper arch */}
      {renderArch(UPPER_ARCH_ORDER, "upper")}

      {/* Arch divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-dashed border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            교합선 (Occlusal Line)
          </span>
        </div>
      </div>

      {/* Lower arch */}
      {renderArch(LOWER_ARCH_ORDER, "lower")}

      <div className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest">
        하악 (Mandibular / Lower Arch)
      </div>

      {/* Instructions */}
      <p className="text-center text-[10px] text-slate-400">
        치아를 클릭하여 선택 · 팔레트에서 상태 도구 선택 후 치아에 적용
      </p>
    </div>
  );
}
