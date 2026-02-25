"use client";
import { useState, useRef, useEffect } from "react";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { TOOTH_DEFINITIONS } from "@/lib/constants";
import type { ToothCondition } from "@/lib/types";

export default function CommandCenter() {
  const record        = useActiveRecord();
  const addNote       = useDentalStore((s) => s.addNote);
  const deleteNote    = useDentalStore((s) => s.deleteNote);
  const selectTooth   = useDentalStore((s) => s.selectTooth);
  const setToothStatus = useDentalStore((s) => s.setToothStatus);

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [record.notes.length]);

  function handleEnter() {
    const text = input.trim();
    if (!text) return;

    if (text.startsWith("/")) {
      const [cmd, ...args] = text.slice(1).split(" ");
      if (cmd === "select" && args[0]) {
        const tooth = TOOTH_DEFINITIONS.find((t) => t.fdi === args[0]);
        if (tooth) selectTooth(tooth.id);
      } else if (cmd === "set" && args[0] && args[1]) {
        const tooth = TOOTH_DEFINITIONS.find((t) => t.fdi === args[0]);
        if (tooth) setToothStatus(tooth.id, args[1] as ToothCondition);
      }
    } else {
      addNote(text);
    }

    setInput("");
  }

  return (
    <div className="flex flex-col bg-gray-950 border-t border-gray-800 shrink-0" style={{ height: "220px" }}>
      {/* Header */}
      <div className="px-4 py-1.5 border-b border-gray-800 flex items-center gap-3 shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">
          Command Center
        </span>
        <span className="text-xs text-gray-700 font-mono">
          /select &lt;FDI&gt; · /set &lt;FDI&gt; &lt;상태&gt; · Enter로 기록 추가
        </span>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 font-mono">
        {record.notes.length === 0 && (
          <div className="text-xs text-gray-700 italic">진료 기록이 없습니다.</div>
        )}
        {record.notes.map((note) => (
          <div key={note.id} className="flex items-start gap-3 group text-xs">
            <span className="text-gray-600 shrink-0 tabular-nums">
              {new Date(note.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className="text-green-400 flex-1">{note.content}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              ✕
            </button>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-800 px-4 py-2 flex items-center gap-2 shrink-0">
        <span className="text-green-500 font-mono text-sm shrink-0">›</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnter()}
          placeholder="진료 기록 또는 명령어 입력..."
          className="flex-1 bg-transparent text-green-300 placeholder-gray-700 outline-none text-xs font-mono"
        />
      </div>
    </div>
  );
}
