"use client";
import { useState } from "react";
import { useDentalStore } from "@/lib/dentalStore";

export default function ClinicalNotes() {
  const notes = useDentalStore((s) => s.record.notes);
  const addNote = useDentalStore((s) => s.addNote);
  const deleteNote = useDentalStore((s) => s.deleteNote);
  const [text, setText] = useState("");

  function handleAdd() {
    if (!text.trim()) return;
    addNote(text.trim());
    setText("");
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Notes</h3>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add clinical note..."
          className="flex-1 text-sm border border-gray-200 rounded px-2 py-1"
        />
        <button
          onClick={handleAdd}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note.id}
            className="text-sm border border-gray-100 rounded p-2 flex justify-between gap-2"
          >
            <span className="text-gray-700">{note.content}</span>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-400 hover:text-red-600 shrink-0"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
