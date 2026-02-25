"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { CONDITION_META, CONDITION_PALETTE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function ChartLegend() {
  const activeTool = useDentalStore((s) => s.activeTool);
  const setActiveTool = useDentalStore((s) => s.setActiveTool);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-wrap gap-2">
      {CONDITION_PALETTE.map((tool) => (
        <button
          key={tool}
          onClick={() => setActiveTool(tool)}
          className={cn(
            "px-2 py-1 rounded text-xs font-medium border transition-colors",
            activeTool === tool
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          )}
        >
          {tool === "select"
            ? "↖ 선택"
            : tool === "eraser"
            ? "⌫ 지우개"
            : `${CONDITION_META[tool]?.icon} ${CONDITION_META[tool]?.label}`}
        </button>
      ))}
    </div>
  );
}
