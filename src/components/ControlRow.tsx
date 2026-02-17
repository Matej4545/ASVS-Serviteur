import { NotebookPen } from "lucide-react";
import { useState } from "react";
import { cn, replaceLink } from "../lib/helpers";
import { ASVSAuditResult } from "../types/types";

interface IControlRowProps {
  shortCode: string;
  description: string;
  requiredFrom: string;
  initialState: ASVSAuditResult;
  cwe?: string;
  nist?: string;
  handleStatusChange: (
    shortcode: string,
    status: "compliant" | "noncompliant" | "partial" | "na",
  ) => void;
  handleNote: (note: string) => void;
}

function ControlRow(props: IControlRowProps) {
  const {
    shortCode,
    description,
    requiredFrom,
    handleStatusChange,
    initialState,
    cwe,
    nist,
    handleNote,
  } = props;

  // Determine current status from initialState
  const getStatus = (
    state: ASVSAuditResult,
  ): "compliant" | "noncompliant" | "partial" | "na" => {
    if (state.NA) return "na";
    if (state.partial) return "partial";
    if (state.checked) return "compliant";
    return "noncompliant";
  };

  const [status, setStatus] = useState<
    "compliant" | "noncompliant" | "partial" | "na"
  >(getStatus(initialState));
  const [note, setNote] = useState(initialState.note || "");
  const [isNoteEditorOpen, setIsNoteEditorOpen] = useState(!!initialState.note);
  const [editingNote, setEditingNote] = useState(initialState.note || "");

  const { textWithoutLink, linkText, link } = replaceLink(description);

  const statusStyles: Record<string, string> = {
    compliant: "bg-emerald-500 text-white",
    noncompliant: "bg-rose-500 text-white",
    partial: "bg-amber-400 text-slate-900",
    na: "bg-slate-200 text-slate-700",
  };

  const statusLabels: Record<string, string> = {
    compliant: "Compliant",
    noncompliant: "Non-compliant",
    partial: "Partial",
    na: "N/A",
  };

  const handleStatusClick = (
    newStatus: "compliant" | "noncompliant" | "partial" | "na",
  ) => {
    setStatus(newStatus);
    handleStatusChange(shortCode, newStatus);
  };

  const handleSaveNote = () => {
    setNote(editingNote);
    handleNote(editingNote);
    setIsNoteEditorOpen(false);
  };

  const handleCancelNote = () => {
    setEditingNote(note);
    if (!note) {
      setIsNoteEditorOpen(false);
    }
  };

  const handleNoteIconClick = () => {
    setIsNoteEditorOpen(!isNoteEditorOpen);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
      <div className="grid gap-3 md:grid-cols-[70px_1fr_240px]">
        <div className="font-mono text-xs font-semibold text-slate-700">
          {shortCode}
        </div>
        <div className="space-y-1">
          <p className="text-sm leading-snug text-slate-800">
            {textWithoutLink}{" "}
            {link && (
              <a
                href={link}
                target="_blank"
                className="text-blue-500 underline"
              >
                {linkText}
              </a>
            )}
          </p>
          <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
              {requiredFrom}
            </span>
            {cwe && cwe.length > 0 && (
              <a
                href={`https://cwe.mitre.org/data/definitions/${cwe}`}
                target="_blank"
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:border-orange-300"
              >
                {cwe}
              </a>
            )}
            {nist && nist.length > 0 && (
              <a
                href="https://pages.nist.gov/800-63-3/sp800-63-3.html"
                target="_blank"
                className="rounded-full border border-slate-200 bg-white px-2 py-0.5 hover:border-orange-300"
              >
                {nist}
              </a>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
              Status
            </span>
            <span
              className={cn(
                "w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                statusStyles[status],
              )}
            >
              {statusLabels[status]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="grid flex-1 grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white text-[10px] font-semibold text-slate-600">
              {[
                { label: "Compliant", value: "compliant" as const },
                { label: "Non", value: "noncompliant" as const },
                { label: "Partial", value: "partial" as const },
                { label: "N/A", value: "na" as const },
              ].map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => handleStatusClick(value)}
                  className={cn(
                    "px-1 py-1 leading-tight text-center whitespace-normal hover:bg-slate-100",
                    status === value && "bg-slate-100 font-bold",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={handleNoteIconClick}
              aria-label={note ? "Edit note" : "Add note"}
              className={cn(
                "rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:border-orange-300",
                note && "border-orange-300 bg-orange-50",
              )}
            >
              <NotebookPen size={14} />
            </button>
          </div>
        </div>
      </div>
      {isNoteEditorOpen && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
            Notes
          </div>
          <textarea
            className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:border-orange-400 focus:outline-none"
            value={editingNote}
            onChange={(e) => setEditingNote(e.target.value)}
            placeholder="Add notes about this control..."
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              onClick={handleCancelNote}
              className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlRow;
