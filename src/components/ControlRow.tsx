import { EyeOff, Link, NotebookPen } from "lucide-react";
import { useState } from "react";
import { cn, replaceLink } from "../lib/helpers";
import { ASVSAuditResult } from "../types/types";
import Tooltip from "./tooltip/tooltip";

interface IControlRowProps {
  shortCode: string;
  description: string;
  requiredFrom: string;
  initialState: ASVSAuditResult;
  cwe?: string;
  nist?: string;
  handleChecked: (shortcode: string) => void;
  handleNote: (note: string) => void;
  handleNA: (shortcode: string) => void;
}

function ControlRow(props: IControlRowProps) {
  const {
    shortCode,
    description,
    requiredFrom,
    handleChecked,
    initialState,
    cwe,
    nist,
    handleNote,
    handleNA,
  } = props;
  const [checked, setChecked] = useState(initialState.checked);
  const [NA, setNA] = useState(initialState.NA);
  const [note, setNote] = useState(initialState.note);
  const [showNotes, setShowNotes] = useState(note && true);
  const { textWithoutLink, linkText, link } = replaceLink(description);
  return (
    <div
      className={cn(
        "my-1 grid grid-cols-12 items-center rounded-lg px-2 bg-slate-200 py-2 ",
        NA && "line-through bg-slate-100 text-slate-300",
      )}
    >
      <p className="break-all">{shortCode}</p>
      <div className="col-span-9 text-left text-pretty break-words	">
        <p>
          {textWithoutLink}{" "}
          {link && (
            <a href={link} target="_blank">
              {linkText}
            </a>
          )}
        </p>
      </div>

      <div className="flex flex-col  gap-2 justify-center items-center">
        <Tooltip text="Required from level">
          <span>{requiredFrom}</span>
        </Tooltip>
        {cwe?.length != 0 && (
          <Tooltip text="CWE number">
            <a
              href={`https://cwe.mitre.org/data/definitions/` + cwe}
              target="_blank"
            >
              {cwe}
            </a>
          </Tooltip>
        )}
        {nist?.length != 0 && (
          <Tooltip text="NIST reference">
            <span>{nist}</span>
            <a href="https://pages.nist.gov/800-63-3/sp800-63-3.html">
              <Link size={18} className="mx-2" />
            </a>
          </Tooltip>
        )}
      </div>
      <div className="flex gap-1 flex-col justify-center">
        <div className="flex gap-1 items-center flex-wrap">
          <input
            type="checkbox"
            name="checked"
            className="w-5 h-5"
            onClick={() => {
              handleChecked(shortCode), setChecked(!checked);
            }}
            checked={checked}
          />{" "}
          <label htmlFor="checked">Compliant</label>
        </div>
        <div className="flex gap-1 items-center flex-wrap">
          <input
            name="NA"
            type="checkbox"
            className="w-5 h-5"
            onClick={() => {
              handleNA(shortCode), setNA(!NA);
            }}
            checked={NA}
          />{" "}
          <label htmlFor="NA">N/A</label>
        </div>
        <div className="pt-2" onClick={() => setShowNotes(!showNotes)}>
          {showNotes ? (
            <EyeOff size={20} className="text-slate-700" />
          ) : (
            <NotebookPen className="text-slate-700" size={20} />
          )}
        </div>
      </div>
      {showNotes && (
        <div className="row-start-2 col-span-12">
          <textarea
            className="w-full h-18 rounded-md p-2"
            name="notes"
            value={note}
            onChange={(e) => {
              handleNote && handleNote(e.target.value);
              setNote(e.target.value);
            }}
            placeholder="Notes..."
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default ControlRow;
