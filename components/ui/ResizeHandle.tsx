"use client";

interface ResizeHandleProps {
  /** 드래그 중 발생하는 incremental 이동량(px)을 전달합니다. */
  onDelta: (delta: number) => void;
  /** "horizontal": 좌우 패널 경계 (기본값) | "vertical": 상하 패널 경계 */
  direction?: "horizontal" | "vertical";
}

/**
 * 패널 사이에 놓는 드래그 핸들.
 * direction에 따라 수평(col-resize) / 수직(row-resize) 으로 동작합니다.
 */
export default function ResizeHandle({ onDelta, direction = "horizontal" }: ResizeHandleProps) {
  const isHorizontal = direction === "horizontal";

  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();

    let lastPos = isHorizontal ? e.clientX : e.clientY;

    document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
    document.body.style.userSelect = "none";

    function onMouseMove(e: MouseEvent) {
      const currentPos = isHorizontal ? e.clientX : e.clientY;
      const delta = currentPos - lastPos;
      lastPos = currentPos;
      onDelta(delta);
    }

    function onMouseUp() {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      title="드래그하여 크기 조정"
      className={`shrink-0 bg-gray-700 hover:bg-blue-500 active:bg-blue-400 transition-colors duration-150 ${
        isHorizontal
          ? "w-1 cursor-col-resize"
          : "h-1 cursor-row-resize"
      }`}
    />
  );
}
