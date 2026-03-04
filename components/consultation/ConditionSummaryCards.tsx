"use client";
import { useActiveRecord } from "@/lib/dentalStore";
import { GROUP_CONDITIONS, GROUP_META, type ConsultGroup } from "@/lib/consultationGroups";

const GROUP_ORDER: ConsultGroup[] = ["treatment", "restoration", "missing", "perio", "normal"];

export default function ConditionSummaryCards() {
  const record = useActiveRecord();
  const teethList = Object.values(record.teeth);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {GROUP_ORDER.map((key) => {
        const conditions = GROUP_CONDITIONS[key];
        const meta = GROUP_META[key];
        const matched = teethList.filter((t) => (conditions as string[]).includes(t.status));

        return (
          <div
            key={key}
            className={`rounded-xl border ${meta.twBg} ${meta.twBorder} p-4 shadow-sm flex flex-col gap-2`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{meta.emoji}</span>
              <span className={`text-sm font-semibold ${meta.twText}`}>{meta.label}</span>
            </div>
            <div className={`text-3xl font-bold ${meta.twText}`}>
              {matched.length}<span className="text-base font-normal ml-0.5">개</span>
            </div>
            {matched.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {matched.map((t) => (
                  <span
                    key={t.id}
                    className={`text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-white border ${meta.twBorder} ${meta.twText}`}
                  >
                    #{t.fdi}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-gray-400">해당 없음</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
