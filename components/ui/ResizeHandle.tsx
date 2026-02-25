"use client";

interface ResizeHandleProps {
  /** 마우스 드래그 중 발생하는 incremental X 이동량(px)을 전달합니다. */
  onDelta: (deltaX: number) => void;
}

/**
 * 패널 사이에 놓는 드래그 핸들.
 * - 마우스다운 → 문서 전체에서 mousemove 추적 → 마우스업 시 정리
 * - 드래그 중 텍스트 선택 및 커서 변경을 방지합니다.
 */
export default function ResizeHandle({ onDelta }: ResizeHandleProps) {
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();

    let lastX = e.clientX;

    // 드래그 중 커서·텍스트선택 고정
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    function onMouseMove(e: MouseEvent) {
      const delta = e.clientX - lastX;
      lastX = e.clientX;
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
      className="w-1 shrink-0 bg-gray-700 hover:bg-blue-500 active:bg-blue-400 cursor-col-resize transition-colors duration-150"
    />
  );
}
