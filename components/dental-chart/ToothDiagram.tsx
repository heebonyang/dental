"use client";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { UPPER_ARCH_ORDER, LOWER_ARCH_ORDER, UPPER_DECIDUOUS_ORDER, LOWER_DECIDUOUS_ORDER } from "@/lib/constants";
import ToothCell from "./ToothCell";

// 영구치 셀 너비(36px SVG + 2+2px padding) = 40px → 스페이서 3개 = 120px
const PERM_CELL_W = 40;
const DECIDUOUS_SPACER = PERM_CELL_W * 3;

export default function ToothDiagram() {
  const record       = useActiveRecord();
  const selectedTooth = useDentalStore((s) => s.selectedTooth);
  const selectTooth  = useDentalStore((s) => s.selectTooth);

  function handleClick(id: number) {
    selectTooth(id);
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 overflow-x-auto">
      {/* 상악 영구치 */}
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

      {/* 상악 유치 */}
      <div className="flex justify-center gap-0">
        <div style={{ width: DECIDUOUS_SPACER, flexShrink: 0 }} />
        {UPPER_DECIDUOUS_ORDER.map((id) => (
          <ToothCell
            key={id}
            tooth={record.teeth[id]}
            isSelected={selectedTooth === id}
            onClick={() => handleClick(id)}
            isPrimary
          />
        ))}
        <div style={{ width: DECIDUOUS_SPACER, flexShrink: 0 }} />
      </div>

      {/* 중앙 교합선 */}
      <div className="border-t-2 border-dashed border-gray-300 my-0" />

      {/* 하악 유치 */}
      <div className="flex justify-center gap-0">
        <div style={{ width: DECIDUOUS_SPACER, flexShrink: 0 }} />
        {LOWER_DECIDUOUS_ORDER.map((id) => (
          <ToothCell
            key={id}
            tooth={record.teeth[id]}
            isSelected={selectedTooth === id}
            onClick={() => handleClick(id)}
            isPrimary
          />
        ))}
        <div style={{ width: DECIDUOUS_SPACER, flexShrink: 0 }} />
      </div>

      {/* 하악 영구치 */}
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
