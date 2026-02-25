"use client";
import { useState } from "react";
import { useDentalStore } from "@/lib/dentalStore";
import { fmtDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Brain, ChevronDown, ChevronUp, Clock } from "lucide-react";
import type { ClinicalNote } from "@/lib/types";

interface NoteItemProps {
  note: ClinicalNote;
  onDelete: (id: string) => void;
  onAnalyze: (id: string) => void;
  isAnalyzing: boolean;
}

function NoteItem({ note, onDelete, onAnalyze, isAnalyzing }: NoteItemProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden animate-fade-in">
      {/* Note header */}
      <div
        className="flex items-center justify-between px-3 py-2.5 bg-slate-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">{note.author}</p>
            <p className="text-[10px] text-slate-400">{fmtDate(note.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {note.aiAnalysis && (
            <Badge variant="info">AI 분석 완료</Badge>
          )}
          {note.linkedToothIds.length > 0 && (
            <Badge variant="default">
              #{note.linkedToothIds.join(", #")}
            </Badge>
          )}
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-3 py-2.5 space-y-2.5">
          {/* Note content */}
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
            {note.content}
          </p>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <button
              onClick={() => onAnalyze(note.id)}
              disabled={isAnalyzing}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                note.aiAnalysis
                  ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                  : "bg-clinical-600 text-white hover:bg-clinical-700",
                isAnalyzing && "opacity-50 cursor-not-allowed"
              )}
            >
              <Brain className="w-3.5 h-3.5" />
              {isAnalyzing
                ? "분석 중..."
                : note.aiAnalysis
                ? "재분석"
                : "AI 분석 시작"}
            </button>
            <button
              onClick={() => {
                if (confirm("이 노트를 삭제하시겠습니까?")) onDelete(note.id);
              }}
              className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function ClinicalNotes() {
  const notes = useDentalStore((s) => s.record.notes);
  const patient = useDentalStore((s) => s.record.patient);
  const deleteNote = useDentalStore((s) => s.deleteNote);
  const addNote = useDentalStore((s) => s.addNote);
  const analyzeNote = useDentalStore((s) => s.analyzeNote);
  const isAIAnalyzing = useDentalStore((s) => s.ui.isAIAnalyzing);
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!newContent.trim()) return;
    addNote(newContent.trim(), patient.provider);
    setNewContent("");
    setIsAdding(false);
  };

  return (
    <div className="panel flex flex-col">
      <div className="panel-header">
        <h2 className="panel-title">진료 기록 (Clinical Notes)</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          새 노트
        </button>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto scrollbar-thin flex-1">
        {/* New note input */}
        {isAdding && (
          <div className="border-2 border-clinical-200 rounded-xl p-3 space-y-2 bg-clinical-50 animate-fade-in">
            <textarea
              autoFocus
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="진료 소견을 입력하세요... (예: #14 caries, 근심면, 복합레진 충전 필요)"
              rows={4}
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-clinical-500 resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setIsAdding(false); setNewContent(""); }}
                className="btn-ghost"
              >
                취소
              </button>
              <button
                onClick={handleAdd}
                disabled={!newContent.trim()}
                className={cn(
                  "btn-primary",
                  !newContent.trim() && "opacity-50 cursor-not-allowed"
                )}
              >
                저장
              </button>
            </div>
          </div>
        )}

        {/* Note list */}
        {notes.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-sm">진료 기록이 없습니다</p>
            <p className="text-xs mt-1">새 노트 버튼을 눌러 추가하세요</p>
          </div>
        ) : (
          notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onAnalyze={analyzeNote}
              isAnalyzing={isAIAnalyzing}
            />
          ))
        )}
      </div>
    </div>
  );
}
