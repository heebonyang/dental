"use client";
import { useDentalStore } from "@/lib/dentalStore";
import { CONDITION_META } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import {
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronRight,
  Cpu,
  Key,
  TrendingUp,
  Tag,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import type { AIAnalysisResult, AIKeyword, DiagnosisSuggestion, RecommendedTreatment } from "@/lib/types";

// ── Keyword chip ──────────────────────────────────────────
const CATEGORY_STYLES: Record<AIKeyword["category"], string> = {
  condition: "bg-red-100 text-red-700 border-red-200",
  treatment: "bg-blue-100 text-blue-700 border-blue-200",
  anatomy:   "bg-slate-100 text-slate-600 border-slate-200",
  symptom:   "bg-amber-100 text-amber-700 border-amber-200",
  material:  "bg-teal-100 text-teal-700 border-teal-200",
  modifier:  "bg-purple-100 text-purple-700 border-purple-200",
};

const CATEGORY_KO: Record<AIKeyword["category"], string> = {
  condition: "상태",
  treatment: "치료",
  anatomy:   "해부",
  symptom:   "증상",
  material:  "재료",
  modifier:  "수식",
};

function KeywordChip({ kw }: { kw: AIKeyword }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs font-medium",
        CATEGORY_STYLES[kw.category]
      )}
      title={`카테고리: ${CATEGORY_KO[kw.category]} | 연관도: ${(kw.relevance * 100).toFixed(0)}%`}
    >
      <Tag className="w-2.5 h-2.5" />
      {kw.term}
      <span className="opacity-60 text-[9px]">{(kw.relevance * 100).toFixed(0)}%</span>
    </div>
  );
}

// ── Diagnosis card ────────────────────────────────────────
function DiagnosisCard({ diag }: { diag: DiagnosisSuggestion }) {
  const barWidth = `${(diag.confidence * 100).toFixed(0)}%`;
  const severityVariant =
    diag.severity === "severe" ? "danger"
    : diag.severity === "moderate" ? "warning"
    : "success";

  return (
    <div className="border border-slate-200 rounded-lg p-2.5 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-800 leading-tight">
            {diag.diagnosis}
          </p>
          {diag.icdCode && (
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              ICD-10: {diag.icdCode}
            </p>
          )}
        </div>
        <Badge variant={severityVariant} className="flex-shrink-0">
          {diag.severity}
        </Badge>
      </div>

      {/* Confidence bar */}
      <div>
        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
          <span>신뢰도</span>
          <span className="font-medium text-slate-600">{(diag.confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              diag.confidence >= 0.8 ? "bg-emerald-400"
              : diag.confidence >= 0.6 ? "bg-amber-400"
              : "bg-slate-300"
            )}
            style={{ width: barWidth }}
          />
        </div>
      </div>

      {/* Evidence */}
      <div className="flex flex-wrap gap-1">
        {diag.evidenceBasis.slice(0, 3).map((ev, i) => (
          <span
            key={i}
            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-200"
          >
            {ev}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Treatment recommendation ──────────────────────────────
const PRIORITY_STYLES: Record<RecommendedTreatment["priority"], string> = {
  immediate: "bg-red-50 border-red-200 text-red-700",
  soon:      "bg-amber-50 border-amber-200 text-amber-700",
  elective:  "bg-emerald-50 border-emerald-200 text-emerald-700",
};

const PRIORITY_KO: Record<RecommendedTreatment["priority"], string> = {
  immediate: "즉시",
  soon:      "권장",
  elective:  "선택",
};

function TreatmentRow({ rec }: { rec: RecommendedTreatment }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 p-2 rounded-lg border text-xs",
        PRIORITY_STYLES[rec.priority]
      )}
    >
      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
      <div className="min-w-0">
        <span className="font-semibold text-[10px] uppercase tracking-wide opacity-70">
          [{PRIORITY_KO[rec.priority]}]
        </span>{" "}
        {rec.action}
      </div>
    </div>
  );
}

// ── Main AIAnalysisSlot ───────────────────────────────────
export function AIAnalysisSlot() {
  const notes = useDentalStore((s) => s.record.notes);
  const isAnalyzing = useDentalStore((s) => s.ui.isAIAnalyzing);
  const aiError = useDentalStore((s) => s.ui.aiError);
  const analyzeNote = useDentalStore((s) => s.analyzeNote);
  const setHighlightedTeeth = useDentalStore((s) => s.setHighlightedTeeth);

  // Find the most recent note with AI analysis
  const latestAnalyzedNote = notes.find((n) => n.aiAnalysis);
  const result: AIAnalysisResult | null = latestAnalyzedNote?.aiAnalysis ?? null;

  // Most recent note (for quick-analyze)
  const latestNote = notes[0];

  const urgencyConfig = {
    routine:   { label: "일반 (Routine)",   icon: CheckCircle, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
    urgent:    { label: "긴급 (Urgent)",     icon: AlertTriangle, color: "text-amber-600 bg-amber-50 border-amber-200" },
    emergency: { label: "응급 (Emergency)", icon: Zap, color: "text-red-600 bg-red-50 border-red-200" },
  };

  return (
    <div className="panel flex flex-col h-full">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="panel-title">AI 분석 슬롯</h2>
            <p className="text-[10px] text-slate-400">AI Analysis Slot</p>
          </div>
        </div>
        {/* Model indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-full">
          <Cpu className="w-3 h-3 text-slate-500" />
          <span className="text-[10px] text-slate-500 font-medium">
            {result?.modelId ?? "Mock NLP v1.0"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-4">
        {/* API Configuration Slot */}
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Key className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs font-semibold text-slate-600">API 연동 슬롯</p>
            <Badge variant="default">플러그인 가능</Badge>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { name: "Claude (Anthropic)", active: false, env: "NEXT_PUBLIC_CLAUDE_API_KEY" },
              { name: "GPT-4o (OpenAI)",  active: false, env: "NEXT_PUBLIC_OPENAI_API_KEY"  },
              { name: "Custom REST API",  active: false, env: "NEXT_PUBLIC_CUSTOM_AI_ENDPOINT" },
              { name: "Mock NLP Engine",  active: true,  env: "built-in"                      },
            ].map((s) => (
              <div
                key={s.name}
                className={cn(
                  "px-2 py-1.5 rounded-lg border text-center",
                  s.active
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-white border-slate-200"
                )}
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mx-auto mb-1",
                    s.active ? "bg-emerald-400" : "bg-slate-300"
                  )}
                />
                <p className={cn("text-[9px] font-medium leading-tight", s.active ? "text-emerald-700" : "text-slate-500")}>
                  {s.name}
                </p>
                <p className="text-[8px] text-slate-400 font-mono mt-0.5 truncate">
                  {s.env}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-400">
            <code className="bg-slate-200 px-1 rounded">.env.local</code>에 API 키 설정 후 NEXT_PUBLIC_AI_PROVIDER 변경
          </p>
        </div>

        {/* Quick analyze */}
        {latestNote && !latestNote.aiAnalysis && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3">
            <p className="text-xs font-medium text-indigo-700 mb-2">
              최신 노트 분석 준비 완료
            </p>
            <p className="text-[10px] text-indigo-500 mb-2 line-clamp-2">
              "{latestNote.content.slice(0, 80)}..."
            </p>
            <button
              onClick={() => analyzeNote(latestNote.id)}
              disabled={isAnalyzing}
              className={cn(
                "w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                "bg-indigo-600 text-white hover:bg-indigo-700",
                isAnalyzing && "opacity-50 cursor-not-allowed"
              )}
            >
              <Brain className="w-4 h-4" />
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  분석 중...
                </span>
              ) : (
                "AI 분석 시작"
              )}
            </button>
          </div>
        )}

        {/* Error state */}
        {aiError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-red-700">분석 오류</p>
              <p className="text-[10px] text-red-500 mt-0.5">{aiError}</p>
            </div>
          </div>
        )}

        {/* No analysis yet */}
        {!result && !isAnalyzing && !aiError && (
          <div className="text-center py-6 space-y-2">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto">
              <Brain className="w-6 h-6 text-indigo-300" />
            </div>
            <p className="text-sm text-slate-400">분석 결과 없음</p>
            <p className="text-xs text-slate-300">
              진료 기록의 "AI 분석 시작" 버튼을 클릭하세요
            </p>
          </div>
        )}

        {/* Analysis result */}
        {result && (
          <div className="space-y-4 animate-fade-in">
            {/* Urgency banner */}
            {(() => {
              const uc = urgencyConfig[result.urgencyLevel];
              const Icon = uc.icon;
              return (
                <div className={cn("flex items-center gap-2 p-2.5 rounded-xl border", uc.color)}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold">{uc.label}</p>
                    <p className="text-[10px] opacity-70">
                      분석 신뢰도: {(result.confidence * 100).toFixed(0)}%
                      {result.tokenCount && ` · ${result.tokenCount} tokens`}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Keywords */}
            {result.keywords.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    추출 키워드 ({result.keywords.length})
                  </p>
                </div>
                {/* Group by category */}
                {(["condition", "symptom", "treatment", "anatomy", "material", "modifier"] as AIKeyword["category"][]).map(
                  (cat) => {
                    const kws = result.keywords.filter((k) => k.category === cat);
                    if (kws.length === 0) return null;
                    return (
                      <div key={cat} className="mb-2">
                        <p className="text-[9px] uppercase tracking-widest text-slate-400 mb-1">
                          {CATEGORY_KO[cat]}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {kws.map((kw) => (
                            <KeywordChip key={kw.term} kw={kw} />
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {/* Diagnoses */}
            {result.suggestedDiagnoses.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    진단 제안 ({result.suggestedDiagnoses.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {result.suggestedDiagnoses.map((diag, i) => (
                    <DiagnosisCard key={i} diag={diag} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommended treatments */}
            {result.recommendedTreatments.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    치료 권고
                  </p>
                </div>
                <div className="space-y-1.5">
                  {result.recommendedTreatments.map((rec, i) => (
                    <TreatmentRow key={i} rec={rec} />
                  ))}
                </div>
              </div>
            )}

            {/* Metadata footer */}
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>
                <Info className="w-3 h-3 inline mr-1" />
                {result.modelId}
              </span>
              <span>{new Date(result.analyzedAt).toLocaleTimeString("ko-KR")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
