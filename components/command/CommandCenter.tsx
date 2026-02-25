"use client";
import { useState, useRef, useEffect } from "react";
import { useDentalStore, useActiveRecord } from "@/lib/dentalStore";
import { TOOTH_DEFINITIONS } from "@/lib/constants";
import type { ToothCondition } from "@/lib/types";

export default function CommandCenter() {
  const record          = useActiveRecord();
  const addNote         = useDentalStore((s) => s.addNote);
  const deleteNote      = useDentalStore((s) => s.deleteNote);
  const selectTooth     = useDentalStore((s) => s.selectTooth);
  const setToothStatus  = useDentalStore((s) => s.setToothStatus);
  const panelThemes     = useDentalStore((s) => s.panelThemes);
  const togglePanelTheme = useDentalStore((s) => s.togglePanelTheme);

  const dark = panelThemes.command === "dark";

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
    <div
      className={`flex flex-col border-t shrink-0 ${dark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}
      style={{ height: "220px" }}
    >
      {/* Header */}
      <div className={`px-4 py-1.5 border-b flex items-center justify-between shrink-0 ${dark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-semibold uppercase tracking-widest font-mono ${dark ? "text-gray-500" : "text-gray-500"}`}>
            Command Center
          </span>
          <span className={`text-xs font-mono ${dark ? "text-gray-700" : "text-gray-400"}`}>
            /select &lt;FDI&gt; · /set &lt;FDI&gt; &lt;상태&gt; · Enter로 기록 추가
          </span>
        </div>
        <button
          onClick={() => togglePanelTheme("command")}
          title={dark ? "라이트 모드" : "다크 모드"}
          className={`text-xs ${dark ? "text-gray-600 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`}
        >
          {dark ? "☀" : "☾"}
        </button>
      </div>

      {/* History */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 font-mono">
        {record.notes.length === 0 && (
          <div className={`text-xs italic ${dark ? "text-gray-700" : "text-gray-400"}`}>진료 기록이 없습니다.</div>
        )}
        {record.notes.map((note) => (
          <div key={note.id} className="flex items-start gap-3 group text-xs">
            <span className={`shrink-0 tabular-nums ${dark ? "text-gray-600" : "text-gray-400"}`}>
              {new Date(note.date).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span className={`flex-1 ${dark ? "text-green-400" : "text-gray-800"}`}>{note.content}</span>
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
      <div className={`border-t px-4 py-2 flex items-center gap-2 shrink-0 ${dark ? "border-gray-800" : "border-gray-200"}`}>
        <span className={`font-mono text-sm shrink-0 ${dark ? "text-green-500" : "text-gray-500"}`}>›</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleEnter()}
          placeholder="진료 기록 또는 명령어 입력..."
          className={`flex-1 bg-transparent outline-none text-xs font-mono ${
            dark ? "text-green-300 placeholder-gray-700" : "text-gray-800 placeholder-gray-400"
          }`}
        />
      </div>
    </div>
  );
}
