"use client";
import { useState } from "react";
import type { PatientData } from "@/lib/types";

const INPUT_CLASS =
  "w-full text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-400";

interface PatientInfoSectionProps {
  patient: PatientData;
  clinics: string[];
  onSave: (updatedPatient: PatientData) => void;
  onAddClinic: (clinicName: string) => void;
  onDeleteClinic: (clinicName: string) => void;
}

/**
 * 하단 고정 영역: 환자 정보 표시(읽기) / 편집(쓰기) 전환 + 병원 칩 목록.
 * key={patient.id}로 마운트하면 환자 전환 시 편집 상태가 자동 초기화됩니다.
 */
export default function PatientInfoSection({
  patient,
  clinics,
  onSave,
  onAddClinic,
  onDeleteClinic,
}: PatientInfoSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftPatient, setDraftPatient] = useState<PatientData>(patient);
  const [newClinicName, setNewClinicName] = useState("");

  const currentChartNumber = isEditing
    ? (draftPatient.clinic ? draftPatient.chartNumbers[draftPatient.clinic] ?? "" : "")
    : (patient.clinic ? patient.chartNumbers[patient.clinic] ?? "" : "");

  function handleStartEdit() {
    setDraftPatient({ ...patient });
    setIsEditing(true);
  }

  function handleSave() {
    onSave(draftPatient);
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function updateField<K extends keyof PatientData>(key: K, value: PatientData[K]) {
    setDraftPatient((prev) => ({ ...prev, [key]: value }));
  }

  function updateChartNumber(clinic: string, value: string) {
    setDraftPatient((prev) => ({
      ...prev,
      chartNumbers: { ...prev.chartNumbers, [clinic]: value },
    }));
  }

  function handleAddClinic() {
    const trimmedName = newClinicName.trim();
    if (!trimmedName) return;
    onAddClinic(trimmedName);
    updateField("clinic", trimmedName);
    setNewClinicName("");
  }

  return (
    <div className="shrink-0 bg-white border-t border-gray-200">
      {/* 섹션 헤더 */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          환자 정보
        </span>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={handleSave} className="text-xs text-blue-500 hover:underline">
              저장
            </button>
            <button onClick={handleCancel} className="text-xs text-gray-400 hover:underline">
              취소
            </button>
          </div>
        ) : (
          <button onClick={handleStartEdit} className="text-xs text-blue-500 hover:underline">
            수정
          </button>
        )}
      </div>

      {/* 필드 목록 */}
      <div className="px-3 py-2 space-y-1.5">
        {isEditing ? (
          <>
            <FormRow label="이름">
              <input
                value={draftPatient.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={INPUT_CLASS}
              />
            </FormRow>
            <FormRow label="생년월일">
              <input
                type="text"
                value={draftPatient.birthDate}
                onChange={(e) => updateField("birthDate", e.target.value)}
                placeholder="예: 1990-01-01"
                className={INPUT_CLASS}
              />
            </FormRow>
            <FormRow label="성별">
              <select
                value={draftPatient.gender}
                onChange={(e) => updateField("gender", e.target.value as PatientData["gender"])}
                className={INPUT_CLASS}
              >
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </FormRow>
            <FormRow label="연락처">
              <input
                value={draftPatient.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={INPUT_CLASS}
              />
            </FormRow>
            <FormRow label="병원">
              <div className="space-y-1">
                <select
                  value={draftPatient.clinic}
                  onChange={(e) => updateField("clinic", e.target.value)}
                  className={INPUT_CLASS}
                >
                  <option value="">—</option>
                  {clinics.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="flex gap-1">
                  <input
                    value={newClinicName}
                    onChange={(e) => setNewClinicName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddClinic()}
                    placeholder="+ 새 병원"
                    className="flex-1 text-xs border border-dashed border-gray-300 rounded px-2 py-1 focus:outline-none"
                  />
                  <button
                    onClick={handleAddClinic}
                    className="text-xs text-blue-500 px-1 shrink-0"
                  >
                    추가
                  </button>
                </div>
              </div>
            </FormRow>
            <FormRow label="차트번호">
              <input
                value={currentChartNumber}
                onChange={(e) =>
                  draftPatient.clinic && updateChartNumber(draftPatient.clinic, e.target.value)
                }
                disabled={!draftPatient.clinic}
                placeholder={draftPatient.clinic ? "" : "병원 먼저 선택"}
                className={
                  INPUT_CLASS +
                  " disabled:bg-gray-50 disabled:text-gray-300 disabled:placeholder-gray-300"
                }
              />
            </FormRow>
          </>
        ) : (
          <table className="w-full">
            <tbody>
              <DisplayRow label="이름"     value={patient.name} />
              <DisplayRow label="생년월일" value={patient.birthDate} />
              <DisplayRow label="성별"     value={patient.gender === "male" ? "남성" : "여성"} />
              <DisplayRow label="연락처"   value={patient.phone} />
              <DisplayRow label="병원"     value={patient.clinic} />
              <DisplayRow label="차트번호" value={currentChartNumber} />
            </tbody>
          </table>
        )}
      </div>

      {/* 병원 칩 */}
      {clinics.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1">
          {clinics.map((clinic) => (
            <span
              key={clinic}
              className="flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
            >
              {clinic}
              <button
                onClick={() => onDeleteClinic(clinic)}
                className="text-gray-400 hover:text-red-500 ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** 편집 모드의 라벨+입력 행 */
function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-xs text-gray-400 w-14 shrink-0 pt-1">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

/** 읽기 모드의 라벨+값 행 */
function DisplayRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-0.5 text-xs text-gray-400 pr-2 whitespace-nowrap w-14">{label}</td>
      <td className="py-0.5 text-xs text-gray-700 truncate">{value || "—"}</td>
    </tr>
  );
}
