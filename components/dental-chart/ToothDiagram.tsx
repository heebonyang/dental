"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { UPPER_ARCH_ORDER, LOWER_ARCH_ORDER } from "@/lib/constants";
import ToothCell from "./ToothCell";

export default function ToothDiagram() {
  const teeth = useDentalStore((s) => s.record.teeth);
  const selectedTooth = useDentalStore((s) => s.selectedTooth);
  const activeTool = useDentalStore((s) => s.activeTool);
  const selectTooth = useDentalStore((s) => s.selectTooth);
  const setToothStatus = useDentalStore((s) => s.setToothStatus);

  function handleClick(id: number) {
    selectTooth(id);
    if (activeTool !== "select" && activeTool !== "eraser") {
      setToothStatus(id, activeTool);
    }
    if (activeTool === "eraser") {
      setToothStatus(id, "healthy");
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
      <div className="flex justify-center gap-1">
        {UPPER_ARCH_ORDER.map((id) => (
          <ToothCell
            key={id}
            tooth={teeth[id]}
            isSelected={selectedTooth === id}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
      <div className="border-t border-dashed border-gray-200" />
      <div className="flex justify-center gap-1">
        {LOWER_ARCH_ORDER.map((id) => (
          <ToothCell
            key={id}
            tooth={teeth[id]}
            isSelected={selectedTooth === id}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
    </div>
  );
}
