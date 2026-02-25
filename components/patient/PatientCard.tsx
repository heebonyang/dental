"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { calcAge, fmtDate, countByCondition } from "@/lib/utils";
import { CONDITION_META } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { User, Phone, Mail, Calendar, AlertTriangle, Pill, ClipboardList } from "lucide-react";

export function PatientCard() {
  const patient = useDentalStore((s) => s.record.patient);
  const teeth = useDentalStore((s) => s.record.teeth);
  const age = calcAge(patient.birthDate);
  const counts = countByCondition(teeth);

  const topConditions = Object.entries(counts)
    .filter(([cond]) => cond !== "healthy")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="panel p-4 space-y-4">
      {/* Patient header */}
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-clinical-100 flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-clinical-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-800">{patient.name}</h2>
          <p className="text-xs text-slate-500">
            {patient.gender === "female" ? "여성" : patient.gender === "male" ? "남성" : "기타"} ·{" "}
            {age}세 ({patient.birthDate})
          </p>
          <p className="text-xs font-mono text-clinical-600 mt-0.5">
            Chart #{patient.chartNumber}
          </p>
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Phone className="w-3 h-3 text-slate-400" />
          {patient.phone}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Mail className="w-3 h-3 text-slate-400" />
          {patient.email}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>최근 내원: {fmtDate(patient.lastVisit)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Calendar className="w-3 h-3 text-clinical-500" />
          <span>다음 예약: {fmtDate(patient.nextAppointment)}</span>
        </div>
      </div>

      {/* Medical alerts */}
      {(patient.medicalHistory.length > 0 || patient.allergies.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-semibold text-amber-700">Medical Alerts</span>
          </div>
          {patient.allergies.length > 0 && (
            <div className="flex flex-wrap gap-1">
              <span className="text-[10px] text-amber-600 font-medium">알레르기:</span>
              {patient.allergies.map((a) => (
                <Badge key={a} variant="warning">{a}</Badge>
              ))}
            </div>
          )}
          {patient.medicalHistory.map((h) => (
            <p key={h} className="text-[10px] text-amber-700 leading-tight">· {h}</p>
          ))}
        </div>
      )}

      {/* Medications */}
      {patient.medications.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">복용 약물</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {patient.medications.map((m) => (
              <Badge key={m} variant="info">{m}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Chart summary */}
      {topConditions.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">차트 요약</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {topConditions.map(([cond, count]) => {
              const meta = CONDITION_META[cond as keyof typeof CONDITION_META];
              if (!meta) return null;
              return (
                <div
                  key={cond}
                  className={`flex items-center justify-between px-2 py-1 rounded-md ${meta.color} border ${meta.borderColor}`}
                >
                  <span className={`text-[10px] font-medium ${meta.textColor}`}>
                    {meta.shortLabel}
                  </span>
                  <span className={`text-[10px] font-bold ${meta.textColor}`}>
                    {count}치
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Provider */}
      <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between">
        <span>담당: {patient.provider}</span>
        <span className="text-clinical-500 font-medium">편집</span>
      </div>
    </div>
  );
}
