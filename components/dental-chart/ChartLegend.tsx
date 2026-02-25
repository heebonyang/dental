"use client";
import { CONDITION_META, CONDITION_PALETTE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ToothCondition, ConditionTool } from "@/lib/types";

interface ChartLegendProps {
  activeTool: ConditionTool;
  onSelectTool: (tool: ConditionTool) => void;
}

export function ChartLegend({ activeTool, onSelectTool }: ChartLegendProps) {
  return (
    <div className="panel p-3">
      <p className="panel-title mb-2">도구 팔레트 (Tool Palette)</p>

      {/* Special tools */}
      <div className="flex gap-1.5 mb-3">
        {(["select", "surface_edit", "note"] as ConditionTool[]).map((tool) => {
          const labels: Record<string, string> = {
            select: "선택",
            surface_edit: "면 편집",
            note: "노트",
          };
          return (
            <button
              key={tool}
              onClick={() => onSelectTool(tool)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium border transition-all",
                activeTool === tool
                  ? "bg-clinical-600 text-white border-clinical-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-300 hover:border-clinical-400"
              )}
            >
              {labels[tool]}
            </button>
          );
        })}
      </div>

      {/* Condition palette */}
      <div className="grid grid-cols-3 gap-1">
        {CONDITION_PALETTE.map((cond) => {
          const meta = CONDITION_META[cond];
          const isActive = activeTool === cond;
          return (
            <button
              key={cond}
              onClick={() => onSelectTool(cond as ConditionTool)}
              title={meta.description}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md border text-left transition-all",
                meta.color,
                isActive
                  ? `${meta.borderColor} border-2 shadow-sm scale-105`
                  : "border-slate-200 hover:border-slate-400",
              )}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: meta.dotColor }}
              />
              <span className={cn("text-[10px] font-medium leading-tight", meta.textColor)}>
                {meta.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* Legend section */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1.5">
          색상 범례
        </p>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
          {(["healthy", "caries", "filling_composite", "crown_pfc", "missing", "implant", "root_canal", "periodontal_severe"] as ToothCondition[]).map((c) => {
            const m = CONDITION_META[c];
            return (
              <div key={c} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: m.dotColor }} />
                <span className="text-[9px] text-slate-500">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
