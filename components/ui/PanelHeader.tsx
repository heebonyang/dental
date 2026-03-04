"use client";
import { cn } from "@/lib/utils";

interface PanelHeaderProps {
  /** 패널 제목 (좌측 레이블) */
  title: string;
  /** 다크 모드 여부 */
  isDark: boolean;
  /** 테마 토글 버튼 클릭 핸들러 */
  onToggleTheme: () => void;
  /** 테마 토글 버튼 왼쪽에 추가할 버튼 등 */
  children?: React.ReactNode;
  className?: string;
  /** 제목 텍스트에 추가할 클래스 (예: font-mono 등) */
  titleClassName?: string;
}

/**
 * 모든 패널 상단에 공통으로 사용하는 헤더.
 * 제목(좌) + children + 테마 토글 버튼(우) 구조.
 */
export default function PanelHeader({
  title,
  isDark,
  onToggleTheme,
  children,
  className,
  titleClassName,
}: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "px-3 py-2 flex items-center justify-between shrink-0 border-b",
        isDark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200",
        className
      )}
    >
      <span
        className={cn(
          "text-xs font-semibold uppercase tracking-widest",
          isDark ? "text-gray-400" : "text-gray-500",
          titleClassName
        )}
      >
        {title}
      </span>

      <div className="flex items-center gap-2">
        {children}
        <button
          onClick={onToggleTheme}
          title={isDark ? "라이트 모드" : "다크 모드"}
          className={`text-xs ${
            isDark
              ? "text-gray-500 hover:text-gray-300"
              : "text-gray-400 hover:text-gray-700"
          }`}
        >
          {isDark ? "☀" : "☾"}
        </button>
      </div>
    </div>
  );
}
