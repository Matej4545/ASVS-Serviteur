import { EyeOff, Link, NotebookPen } from "lucide-react";
import { useState } from "react";
import { replaceLink } from "../lib/helpers";
import Tooltip from "./tooltip/tooltip";

interface IControlRowProps {
  shortCode: string;
  description: string;
  requiredFrom: string;
  initialNotes?: string;
  initialChecked: boolean;
  cwe?: string;
  nist?: string;
  handleChecked: (shortcode: string) => void;
  handleNote: (note: string) => void;
}

function ControlRow(props: IControlRowProps) {
  const {
    shortCode,
    description,
    requiredFrom,
    handleChecked,
    initialChecked,
    cwe,
    nist,
    initialNotes,
    handleNote,
  } = props;
  const [checked, setChecked] = useState(initialChecked);
  const [notes, setNotes] = useState(initialNotes);
  const [showNotes, setShowNotes] = useState(notes && true);
  const { textWithoutLink, linkText, link } = replaceLink(description);
  return (
    <div className="my-1 grid grid-cols-12 items-center rounded-lg px-2 bg-slate-200 py-2">
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
      <div className="flex gap-1 flex-col justify-center items-center">
        <input
          type="checkbox"
          className="w-5 h-5"
          onClick={() => {
            handleChecked(shortCode), setChecked(!checked);
          }}
          checked={checked}
        />
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
            value={notes}
            onChange={(e) => {
              handleNote && handleNote(e.target.value);
              setNotes(e.target.value);
            }}
            placeholder="Notes..."
          ></textarea>
        </div>
      )}
    </div>
  );
}

export default ControlRow;
