import { useDentalStore } from "@/lib/dentalStore";
import type { PanelId } from "@/lib/types";

/**
 * 패널의 다크/라이트 상태와 토글 함수를 반환합니다.
 * 여러 패널에서 반복되는 panelThemes 선택 + togglePanelTheme 패턴을 제거합니다.
 */
export function usePanelTheme(panelId: PanelId) {
  const isDark = useDentalStore((s) => s.panelThemes[panelId] === "dark");
  const togglePanelTheme = useDentalStore((s) => s.togglePanelTheme);
  return { isDark, toggle: () => togglePanelTheme(panelId) };
}
