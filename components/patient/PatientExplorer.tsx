"use client";
import { useState } from "react";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import type { PatientData } from "@/lib/types";

const INPUT = "w-full text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-400";

export default function PatientExplorer() {
  const records           = useDentalStore((s) => s.records);
  const activeId          = useDentalStore((s) => s.activeRecordId);
  const addRecord         = useDentalStore((s) => s.addRecord);
  const setActive         = useDentalStore((s) => s.setActiveRecord);
  const deleteRecord      = useDentalStore((s) => s.deleteRecord);
  const updatePatient     = useDentalStore((s) => s.updatePatient);
  const clinics           = useDentalStore((s) => s.clinics);
  const addClinic         = useDentalStore((s) => s.addClinic);
  const deleteClinic      = useDentalStore((s) => s.deleteClinic);
  const panelThemes       = useDentalStore((s) => s.panelThemes);
  const togglePanelTheme  = useDentalStore((s) => s.togglePanelTheme);
  const active            = useActiveRecord();

  const dark = panelThemes.explorer === "dark";

  const [search,    setSearch]    = useState("");
  const [editing,   setEditing]   = useState(false);
  const [draft,     setDraft]     = useState<PatientData>(active.patient);
  const [newClinic, setNewClinic] = useState("");

  const filtered = records.filter((r) =>
    !search ||
    r.patient.name.includes(search) ||
    r.patient.clinic.includes(search)
  );

  function selectPatient(id: string) {
    setActive(id);
    setEditing(false);
  }

  function startEdit() {
    setDraft({ ...active.patient });
    setEditing(true);
  }

  function save() {
    updatePatient(draft);
    setEditing(false);
  }

  function setField<K extends keyof PatientData>(key: K, value: PatientData[K]) {
    setDraft((p) => ({ ...p, [key]: value }));
  }

  function setChartNum(clinic: string, value: string) {
    setDraft((p) => ({ ...p, chartNumbers: { ...p.chartNumbers, [clinic]: value } }));
  }

  function handleAddClinic() {
    const name = newClinic.trim();
    if (!name) return;
    addClinic(name);
    setField("clinic", name);
    setNewClinic("");
  }

  const chartNum = editing
    ? (draft.clinic ? (draft.chartNumbers[draft.clinic] ?? "") : "")
    : (active.patient.clinic ? (active.patient.chartNumbers[active.patient.clinic] ?? "") : "");

  return (
    <div className={`flex flex-col h-full overflow-hidden ${dark ? "bg-gray-900" : "bg-white"}`}>
      {/* Panel header */}
      <div className={`px-3 py-2 flex items-center justify-between shrink-0 ${dark ? "bg-gray-900" : "bg-white border-b border-gray-200"}`}>
        <span className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-gray-400" : "text-gray-500"}`}>환자 탐색기</span>
        <div className="flex items-center gap-2">
          <button onClick={addRecord} className={`text-xs font-medium ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800"}`}>
            + 추가
          </button>
          <button
            onClick={() => togglePanelTheme("explorer")}
            title={dark ? "라이트 모드" : "다크 모드"}
            className={`text-xs ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`}
          >
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className={`px-2 py-2 border-b shrink-0 ${dark ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="환자 검색..."
          className={`w-full text-xs rounded px-2 py-1.5 border focus:outline-none ${
            dark
              ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-600 focus:border-blue-500"
              : "bg-white border-gray-200 text-gray-700 placeholder-gray-400 focus:border-blue-400"
          }`}
        />
      </div>

      {/* Patient list */}
      <div className={`flex-1 overflow-y-auto ${dark ? "bg-gray-900" : "bg-gray-50"}`}>
        {filtered.map((rec) => {
          const isActive = rec.patient.id === activeId;
          return (
            <div
              key={rec.patient.id}
              onClick={() => selectPatient(rec.patient.id)}
              className={`px-3 py-2.5 cursor-pointer border-b flex items-center justify-between group transition-colors border-l-2 ${
                isActive
                  ? dark
                    ? "bg-blue-900/40 border-b-gray-800 border-l-blue-400"
                    : "bg-blue-50 border-b-gray-200 border-l-blue-400"
                  : dark
                  ? "hover:bg-gray-800 border-b-gray-800 border-l-transparent"
                  : "hover:bg-gray-100 border-b-gray-200 border-l-transparent"
              }`}
            >
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${
                  isActive ? (dark ? "text-blue-300" : "text-blue-700") : (dark ? "text-gray-300" : "text-gray-700")
                }`}>
                  {rec.patient.name || "이름 없음"}
                </div>
                <div className={`text-xs truncate ${dark ? "text-gray-600" : "text-gray-400"}`}>
                  {rec.patient.clinic || "병원 미지정"}
                </div>
              </div>
              {records.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteRecord(rec.patient.id); }}
                  className="text-gray-700 hover:text-red-400 text-xs ml-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={`px-3 py-4 text-xs text-center ${dark ? "text-gray-600" : "text-gray-400"}`}>검색 결과 없음</div>
        )}
      </div>

      {/* Active patient info */}
      <div className="shrink-0 bg-white border-t border-gray-200">
        <div className="px-3 py-2 flex items-center justify-between border-b border-gray-100 bg-gray-50">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">환자 정보</span>
          {editing ? (
            <div className="flex gap-2">
              <button onClick={save} className="text-xs text-blue-500 hover:underline">저장</button>
              <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:underline">취소</button>
            </div>
          ) : (
            <button onClick={startEdit} className="text-xs text-blue-500 hover:underline">수정</button>
          )}
        </div>

        <div className="px-3 py-2 space-y-1.5">
          {editing ? (
            <>
              <Row label="이름">
                <input value={draft.name} onChange={(e) => setField("name", e.target.value)} className={INPUT} />
              </Row>
              <Row label="생년월일">
                <input type="date" value={draft.birthDate} onChange={(e) => setField("birthDate", e.target.value)} className={INPUT} />
              </Row>
              <Row label="성별">
                <select value={draft.gender} onChange={(e) => setField("gender", e.target.value as PatientData["gender"])} className={INPUT}>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </Row>
              <Row label="연락처">
                <input value={draft.phone} onChange={(e) => setField("phone", e.target.value)} className={INPUT} />
              </Row>
              <Row label="병원">
                <div className="space-y-1">
                  <select value={draft.clinic} onChange={(e) => setField("clinic", e.target.value)} className={INPUT}>
                    <option value="">—</option>
                    {clinics.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <input
                      value={newClinic}
                      onChange={(e) => setNewClinic(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddClinic()}
                      placeholder="+ 새 병원"
                      className="flex-1 text-xs border border-dashed border-gray-300 rounded px-2 py-1 focus:outline-none"
                    />
                    <button onClick={handleAddClinic} className="text-xs text-blue-500 px-1 shrink-0">추가</button>
                  </div>
                </div>
              </Row>
              <Row label="차트번호">
                <input
                  value={chartNum}
                  onChange={(e) => draft.clinic && setChartNum(draft.clinic, e.target.value)}
                  disabled={!draft.clinic}
                  placeholder={draft.clinic ? "" : "병원 먼저 선택"}
                  className={INPUT + " disabled:bg-gray-50 disabled:text-gray-300 disabled:placeholder-gray-300"}
                />
              </Row>
            </>
          ) : (
            <table className="w-full">
              <tbody>
                <InfoRow label="이름"     value={active.patient.name} />
                <InfoRow label="생년월일" value={active.patient.birthDate} />
                <InfoRow label="성별"     value={active.patient.gender === "male" ? "남성" : "여성"} />
                <InfoRow label="연락처"   value={active.patient.phone} />
                <InfoRow label="병원"     value={active.patient.clinic} />
                <InfoRow label="차트번호" value={chartNum} />
              </tbody>
            </table>
          )}
        </div>

        {/* Clinic chips */}
        {clinics.length > 0 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1">
            {clinics.map((c) => (
              <span key={c} className="flex items-center gap-0.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {c}
                <button onClick={() => deleteClinic(c)} className="text-gray-400 hover:text-red-500 ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-xs text-gray-400 w-14 shrink-0 pt-1">{label}</span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <tr>
      <td className="py-0.5 text-xs text-gray-400 pr-2 whitespace-nowrap w-14">{label}</td>
      <td className="py-0.5 text-xs text-gray-700 truncate">{value || "—"}</td>
    </tr>
  );
}
