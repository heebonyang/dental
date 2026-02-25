"use client";
import { cn } from "@/lib/utils";
import { CONDITION_META } from "@/lib/constants";
import type { ToothData, ToothSurface, ToothCondition } from "@/lib/types";
import { useDentalStore } from "@/lib/dentalStore";

interface SurfaceMapProps {
  tooth: ToothData;
}

const SURFACE_LABELS: Record<ToothSurface, string> = {
  occlusal: "교합면 O",
  incisal:  "절단면 I",
  mesial:   "근심 M",
  distal:   "원심 D",
  buccal:   "협면 B",
  lingual:  "설면 L",
};

export function SurfaceMap({ tooth }: SurfaceMapProps) {
  const activeTool = useDentalStore((s) => s.ui.activeTool);
  const setToothSurface = useDentalStore((s) => s.setToothSurface);

  const isAnterior = tooth.type === "incisor" || tooth.type === "canine";

  const handleSurfaceClick = (surface: ToothSurface) => {
    if (activeTool === "select" || activeTool === "note") return;
    if (activeTool === "surface_edit") {
      // Cycle through conditions or clear
      const current = tooth.surfaces[surface];
      setToothSurface(tooth.id, surface, current ? null : tooth.status);
    } else {
      // Apply active condition to this surface
      setToothSurface(tooth.id, surface, activeTool as ToothCondition);
    }
  };

  const getSurfaceStyle = (surface: ToothSurface) => {
    const cond = tooth.surfaces[surface];
    if (!cond) return "bg-slate-50 border-slate-200 text-slate-400";
    const meta = CONDITION_META[cond];
    return `${meta.color} ${meta.borderColor} ${meta.textColor}`;
  };

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        면별 상태 (Surface Status)
      </p>

      {/* Visual surface grid */}
      <div className="flex flex-col items-center gap-1">
        {/* Occlusal / Incisal */}
        <button
          onClick={() => handleSurfaceClick(isAnterior ? "incisal" : "occlusal")}
          className={cn(
            "surface-btn w-28 h-7 text-[10px]",
            getSurfaceStyle(isAnterior ? "incisal" : "occlusal")
          )}
        >
          {SURFACE_LABELS[isAnterior ? "incisal" : "occlusal"]}
        </button>

        {/* Middle row: Mesial | Buccal center | Distal */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSurfaceClick("mesial")}
            className={cn("surface-btn w-10 h-12 flex-col text-[9px]", getSurfaceStyle("mesial"))}
          >
            <span>M</span>
            <span className="text-[7px]">근심</span>
          </button>

          {/* Central box — visual tooth face */}
          <div
            className={cn(
              "w-16 h-12 rounded-lg border-2 flex items-center justify-center flex-col gap-0.5",
              CONDITION_META[tooth.status].color,
              CONDITION_META[tooth.status].borderColor
            )}
          >
            <span className="text-lg">{CONDITION_META[tooth.status].icon}</span>
            <span className={cn("text-[9px] font-bold", CONDITION_META[tooth.status].textColor)}>
              #{tooth.id}
            </span>
          </div>

          <button
            onClick={() => handleSurfaceClick("distal")}
            className={cn("surface-btn w-10 h-12 flex-col text-[9px]", getSurfaceStyle("distal"))}
          >
            <span>D</span>
            <span className="text-[7px]">원심</span>
          </button>
        </div>

        {/* Lingual */}
        <button
          onClick={() => handleSurfaceClick("lingual")}
          className={cn(
            "surface-btn w-28 h-7 text-[10px]",
            getSurfaceStyle("lingual")
          )}
        >
          {SURFACE_LABELS.lingual}
        </button>

        {/* Buccal (separate) */}
        <button
          onClick={() => handleSurfaceClick("buccal")}
          className={cn(
            "surface-btn w-28 h-7 text-[10px]",
            getSurfaceStyle("buccal")
          )}
        >
          {SURFACE_LABELS.buccal}
        </button>
      </div>

      {/* Surface legend */}
      <div className="grid grid-cols-3 gap-1">
        {(Object.entries(tooth.surfaces) as [ToothSurface, ToothCondition | null][]).map(
          ([surface, cond]) => (
            <div
              key={surface}
              className={cn(
                "rounded-md px-1.5 py-1 border text-center",
                cond ? CONDITION_META[cond].color + " " + CONDITION_META[cond].borderColor
                      : "bg-slate-50 border-slate-200"
              )}
            >
              <p className="text-[8px] text-slate-400 uppercase">{surface.slice(0, 3)}</p>
              <p className={cn("text-[9px] font-medium", cond ? CONDITION_META[cond].textColor : "text-slate-400")}>
                {cond ? CONDITION_META[cond].shortLabel : "—"}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
