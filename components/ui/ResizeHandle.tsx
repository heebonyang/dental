"use client";

interface ResizeHandleProps {
  /** 드래그 중 발생하는 incremental 이동량(px)을 전달합니다. */
  onDelta: (delta: number) => void;
  /** "horizontal": 좌우 패널 경계 (기본값) | "vertical": 상하 패널 경계 */
  direction?: "horizontal" | "vertical";
  /** false이면 드래그가 비활성화되고 단순 구분선으로만 표시됩니다. */
  isEnabled?: boolean;
}

/**
 * 패널 사이에 놓는 드래그 핸들.
 * isEnabled=false 시 인터랙션 없는 얇은 구분선으로 표시됩니다.
 */
export default function ResizeHandle({
  onDelta,
  direction = "horizontal",
  isEnabled = true,
}: ResizeHandleProps) {
  const isHorizontal = direction === "horizontal";

  function handleMouseDown(e: React.MouseEvent) {
    if (!isEnabled) return;
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

  if (!isEnabled) {
    // 비활성: 얇은 구분선만 표시
    return (
      <div
        className={`shrink-0 bg-gray-700 ${
          isHorizontal ? "w-px" : "h-px"
        }`}
      />
    );
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      title="드래그하여 크기 조정"
      className={`shrink-0 bg-blue-600 hover:bg-blue-400 active:bg-blue-300 transition-colors duration-150 ${
        isHorizontal
          ? "w-1 cursor-col-resize"
          : "h-1 cursor-row-resize"
      }`}
    />
  );
}
