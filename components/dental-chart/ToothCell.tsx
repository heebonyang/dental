"use client";
import { cn } from "@/lib/utils";
import { CONDITION_META } from "@/lib/constants";
import type { ToothData, ConditionTool } from "@/lib/types";

interface ToothCellProps {
  tooth: ToothData;
  isSelected: boolean;
  isHighlighted: boolean;
  activeTool: ConditionTool;
  onSelect: (id: number) => void;
  onApplyTool: (id: number) => void;
}

export function ToothCell({
  tooth,
  isSelected,
  isHighlighted,
  activeTool,
  onSelect,
  onApplyTool,
}: ToothCellProps) {
  const meta = CONDITION_META[tooth.status];
  const isMissing = tooth.status === "missing";

  const handleClick = () => {
    if (activeTool === "select" || activeTool === "surface_edit" || activeTool === "note") {
      onSelect(tooth.id);
    } else {
      onApplyTool(tooth.id);
      onSelect(tooth.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      title={`#${tooth.id} (${tooth.fdi}) — ${tooth.name}\n${meta.label}`}
      className={cn(
        "tooth-cell w-12 h-12",
        meta.color,
        `border-2`,
        meta.borderColor,
        isSelected && "selected",
        isHighlighted && "ring-2 ring-amber-400 ring-offset-1",
        isMissing && "opacity-40",
      )}
    >
      {/* Tooth number */}
      <span
        className={cn(
          "text-[10px] font-bold leading-none",
          meta.textColor
        )}
      >
        {tooth.id}
      </span>

      {/* FDI code */}
      <span className="text-[8px] text-slate-400 leading-none mt-0.5">
        {tooth.fdi}
      </span>

      {/* Condition icon */}
      <span className={cn("text-[10px] leading-none mt-0.5", meta.textColor)}>
        {isMissing ? "✕" : meta.icon}
      </span>

      {/* Short condition badge */}
      <span
        className={cn(
          "absolute -bottom-1 left-1/2 -translate-x-1/2",
          "text-[7px] font-bold px-1 rounded-sm",
          "bg-white border shadow-sm",
          meta.textColor
        )}
      >
        {meta.shortLabel}
      </span>

      {/* Perio indicator dot */}
      {tooth.status.startsWith("periodontal") && (
        <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500 border border-white" />
      )}

      {/* RCT indicator */}
      {tooth.status === "root_canal" && (
        <span className="absolute top-0 left-0 w-2 h-2 rounded-full bg-orange-400 border border-white" />
      )}
    </div>
  );
}
