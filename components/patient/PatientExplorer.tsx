"use client";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { usePanelTheme } from "@/lib/hooks/usePanelTheme";
import PanelHeader from "@/components/ui/PanelHeader";
import PatientList from "./PatientList";
import PatientInfoSection from "./PatientInfoSection";

/**
 * 좌측 패널: 환자 탐색기
 * - PanelHeader: 제목 + 추가 버튼 + 테마 토글
 * - PatientList: 검색 + 목록
 * - PatientInfoSection: 선택 환자 정보 표시/편집
 */
export default function PatientExplorer() {
  const records         = useDentalStore((s) => s.records);
  const activeId        = useDentalStore((s) => s.activeRecordId);
  const addRecord       = useDentalStore((s) => s.addRecord);
  const setActiveRecord = useDentalStore((s) => s.setActiveRecord);
  const deleteRecord    = useDentalStore((s) => s.deleteRecord);
  const updatePatient   = useDentalStore((s) => s.updatePatient);
  const clinics         = useDentalStore((s) => s.clinics);
  const addClinic       = useDentalStore((s) => s.addClinic);
  const deleteClinic    = useDentalStore((s) => s.deleteClinic);
  const activeRecord    = useActiveRecord();

  const { isDark, toggle } = usePanelTheme("explorer");

  return (
    <div className={`flex flex-col h-full overflow-hidden ${isDark ? "bg-gray-900" : "bg-white"}`}>
      <PanelHeader title="환자 탐색기" isDark={isDark} onToggleTheme={toggle}>
        <button
          onClick={addRecord}
          className={`text-xs font-medium ${
            isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"
          }`}
        >
          + 추가
        </button>
      </PanelHeader>

      <PatientList
        records={records}
        activeId={activeId}
        isDark={isDark}
        onSelect={setActiveRecord}
        onDelete={deleteRecord}
      />

      {/* key로 환자 전환 시 편집 상태 자동 초기화 */}
      <PatientInfoSection
        key={activeRecord.patient.id}
        patient={activeRecord.patient}
        clinics={clinics}
        onSave={updatePatient}
        onAddClinic={addClinic}
        onDeleteClinic={deleteClinic}
      />
    </div>
  );
}
