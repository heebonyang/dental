"use client";
import { useDentalStore } from "@/lib/dentalStore";

export default function ToothDetailPanel() {
  const tooth = useDentalStore((s) =>
    s.selectedTooth ? s.record.teeth[s.selectedTooth] : null
  );
  const updateToothNote = useDentalStore((s) => s.updateToothNote);

  if (!tooth) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-400">
        Select a tooth to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">#{tooth.id} — {tooth.name}</h3>
      <div className="text-sm text-gray-500">FDI: {tooth.fdi} · Status: {tooth.status}</div>
      <textarea
        value={tooth.note}
        onChange={(e) => updateToothNote(tooth.id, e.target.value)}
        placeholder="Clinical note..."
        className="w-full text-sm border border-gray-200 rounded p-2 resize-none h-20"
      />
    </div>
  );
}
