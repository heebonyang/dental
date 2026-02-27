"use client";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { UPPER_ARCH_ORDER, LOWER_ARCH_ORDER } from "@/lib/constants";
import ToothCell from "./ToothCell";

export default function ToothDiagram() {
  const record       = useActiveRecord();
  const selectedTooth = useDentalStore((s) => s.selectedTooth);
  const activeTool   = useDentalStore((s) => s.activeTool);
  const selectTooth  = useDentalStore((s) => s.selectTooth);
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
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 overflow-x-auto">
      {/* 상악 */}
      <div className="flex justify-center gap-0">
        {UPPER_ARCH_ORDER.map((id) => (
          <ToothCell
            key={id}
            tooth={record.teeth[id]}
            isSelected={selectedTooth === id}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>

      {/* 중앙 교합선 */}
      <div className="border-t-2 border-dashed border-gray-300 my-0" />

      {/* 하악 */}
      <div className="flex justify-center gap-0">
        {LOWER_ARCH_ORDER.map((id) => (
          <ToothCell
            key={id}
            tooth={record.teeth[id]}
            isSelected={selectedTooth === id}
            onClick={() => handleClick(id)}
          />
        ))}
      </div>
    </div>
  );
}
