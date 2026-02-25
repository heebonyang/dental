"use client";
import { useState } from "react";
import { useDentalStore } from "@/lib/dentalStore";
import type { PatientData } from "@/lib/types";

const FIELD_CLS = "w-full text-sm border border-gray-200 rounded px-2 py-0.5";

export default function PatientCard() {
  const patient = useDentalStore((s) => s.record.patient);
  const clinics = useDentalStore((s) => s.clinics);
  const updatePatient = useDentalStore((s) => s.updatePatient);
  const addClinic = useDentalStore((s) => s.addClinic);
  const deleteClinic = useDentalStore((s) => s.deleteClinic);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PatientData>(patient);
  const [newClinic, setNewClinic] = useState("");

  function startEdit() { setDraft(patient); setEditing(true); }
  function save() { updatePatient(draft); setEditing(false); }
  function cancel() { setEditing(false); }

  function setField<K extends keyof PatientData>(key: K, value: PatientData[K]) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function setChartNumber(clinic: string, value: string) {
    setDraft((p) => ({
      ...p,
      chartNumbers: { ...p.chartNumbers, [clinic]: value },
    }));
  }

  function handleAddClinic() {
    const name = newClinic.trim();
    if (!name) return;
    addClinic(name);
    setField("clinic", name);
    setNewClinic("");
  }

  // Current chart number to display
  const displayChartNum = (data: PatientData) =>
    data.clinic ? (data.chartNumbers[data.clinic] ?? "") : "";

  const d = editing ? draft : patient;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800">환자 정보</h2>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={save} className="text-xs text-blue-500 hover:underline">저장</button>
            <button onClick={cancel} className="text-xs text-gray-400 hover:underline">취소</button>
          </div>
        ) : (
          <button onClick={startEdit} className="text-xs text-blue-500 hover:underline">수정</button>
        )}
      </div>

      {/* Table — identical structure in both modes */}
      <table className="w-full text-sm">
        <tbody>
          <Row label="이름">
            {editing
              ? <input value={draft.name} onChange={(e) => setField("name", e.target.value)} className={FIELD_CLS} />
              : <span>{d.name || "—"}</span>}
          </Row>

          <Row label="생년월일">
            {editing
              ? <input type="date" value={draft.birthDate} onChange={(e) => setField("birthDate", e.target.value)} className={FIELD_CLS} />
              : <span>{d.birthDate || "—"}</span>}
          </Row>

          <Row label="성별">
            {editing
              ? (
                <select value={draft.gender} onChange={(e) => setField("gender", e.target.value as PatientData["gender"])} className={FIELD_CLS}>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                  <option value="other">기타</option>
                </select>
              )
              : <span>{d.gender === "male" ? "남성" : d.gender === "female" ? "여성" : "기타"}</span>}
          </Row>

          <Row label="연락처">
            {editing
              ? <input value={draft.phone} onChange={(e) => setField("phone", e.target.value)} className={FIELD_CLS} />
              : <span>{d.phone || "—"}</span>}
          </Row>

          <Row label="병원">
            {editing
              ? (
                <div className="space-y-1">
                  <select value={draft.clinic} onChange={(e) => setField("clinic", e.target.value)} className={FIELD_CLS}>
                    <option value="">—</option>
                    {clinics.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <input
                      value={newClinic}
                      onChange={(e) => setNewClinic(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddClinic()}
                      placeholder="+ 새 병원 추가"
                      className="flex-1 text-xs border border-dashed border-gray-300 rounded px-2 py-0.5 placeholder-gray-300"
                    />
                    <button onClick={handleAddClinic} className="text-xs text-blue-500 px-1 shrink-0">추가</button>
                  </div>
                </div>
              )
              : <span>{d.clinic || "—"}</span>}
          </Row>

          <Row label="차트번호">
            {editing
              ? (
                <input
                  value={displayChartNum(draft)}
                  onChange={(e) => draft.clinic && setChartNumber(draft.clinic, e.target.value)}
                  disabled={!draft.clinic}
                  placeholder={draft.clinic ? "" : "병원을 먼저 선택하세요"}
                  className={FIELD_CLS + " disabled:bg-gray-50 disabled:text-gray-400 disabled:placeholder-gray-300"}
                />
              )
              : <span>{displayChartNum(patient) || "—"}</span>}
          </Row>
        </tbody>
      </table>

      {/* Registered clinics list */}
      {clinics.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">등록 클리닉</p>
          <ul className="space-y-0.5">
            {clinics.map((c) => (
              <li key={c} className="flex items-center justify-between text-xs text-gray-600">
                <span>{c}</span>
                <button onClick={() => deleteClinic(c)} className="text-red-300 hover:text-red-500 ml-2">✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-t border-gray-50 first:border-0">
      <td className="py-1.5 pr-3 text-xs text-gray-400 whitespace-nowrap align-top w-14">{label}</td>
      <td className="py-1.5 text-gray-800 align-top">{children}</td>
    </tr>
  );
}
