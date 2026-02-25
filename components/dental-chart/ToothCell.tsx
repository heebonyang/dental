import { cn } from "@/lib/utils";
import { CONDITION_META } from "@/lib/constants";
import type { ToothData } from "@/lib/types";

interface Props {
  tooth: ToothData;
  isSelected: boolean;
  onClick: () => void;
}

export default function ToothCell({ tooth, isSelected, onClick }: Props) {
  const meta = CONDITION_META[tooth.status];

  return (
    <button
      onClick={onClick}
      title={`#${tooth.id} ${tooth.name}`}
      className={cn(
        "w-10 h-12 flex flex-col items-center justify-center rounded border text-xs transition-all",
        isSelected ? "ring-2 ring-blue-500 border-blue-400" : "border-gray-200 hover:border-gray-400",
        meta?.color ?? "bg-white"
      )}
    >
      <span className="text-gray-400 leading-none">{tooth.id}</span>
      <span className="font-bold leading-none">{meta?.icon ?? "?"}</span>
      <span className="text-gray-400 leading-none">{tooth.fdi}</span>
    </button>
  );
}
