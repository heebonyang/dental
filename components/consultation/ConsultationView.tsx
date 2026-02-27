"use client";
import { useState } from "react";
import { useActiveRecord } from "@/lib/dentalStore";
import ConsultationToothChart from "./ConsultationToothChart";
import TreatmentPlanTable from "./TreatmentPlanTable";
import ConditionSummaryCards from "./ConditionSummaryCards";

export default function ConsultationView() {
  const record = useActiveRecord();
  const { patient } = record;

  const [highlightedTooth, setHighlightedTooth] = useState<number | null>(null);

  function handleToothClick(id: number) {
    setHighlightedTooth((prev) => (prev === id ? null : id));
  }

  const birthYear = patient.birthDate ? patient.birthDate.slice(0, 4) : null;
  const age = birthYear ? new Date().getFullYear() - parseInt(birthYear) : null;

  return (
    <div className="flex-1 overflow-y-auto bg-stone-50 p-6 space-y-6">

      {/* 환자 정보 헤더 */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-6 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">환자명</p>
          <p className="text-xl font-bold text-gray-900">
            {patient.name || <span className="text-gray-400 font-normal">미입력</span>}
          </p>
        </div>
        {age != null && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">나이</p>
            <p className="text-lg font-semibold text-gray-700">{age}세</p>
          </div>
        )}
        {patient.birthDate && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">생년월일</p>
            <p className="text-base text-gray-700">{patient.birthDate}</p>
          </div>
        )}
        {patient.clinic && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">클리닉</p>
            <p className="text-base text-gray-700">{patient.clinic}</p>
          </div>
        )}
        {patient.chartNumbers[patient.clinic] && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">차트번호</p>
            <p className="text-base text-gray-700">{patient.chartNumbers[patient.clinic]}</p>
          </div>
        )}
        <div className="ml-auto">
          <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">
            환자 상담 모드
          </span>
        </div>
      </div>

      {/* 치아 차트 + 치료 계획 테이블 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">치아 상태 지도</h2>
          <ConsultationToothChart
            highlightedToothId={highlightedTooth}
            onToothClick={handleToothClick}
          />
        </div>
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">치료 계획 및 예상 비용</h2>
          <TreatmentPlanTable
            highlightedToothId={highlightedTooth}
            onRowClick={handleToothClick}
          />
        </div>
      </div>

      {/* 상태 요약 카드 */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">상태별 요약</h2>
        <ConditionSummaryCards />
      </div>
    </div>
  );
}
