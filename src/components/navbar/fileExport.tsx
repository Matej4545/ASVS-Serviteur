import { Download } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/helpers";
import { ASVSAudit } from "../../types/types";
import Tooltip from "../tooltip/tooltip";

interface IFileExport {
  data: ASVSAudit;
}

function FileExport(props: IFileExport) {
  const { data } = props;
  const [fileName, setFileName] = useState(
    `ASVS Audit - ${data.name}_${
      data.date && new Date(data.date).toLocaleDateString()
    }`,
  );
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Tooltip text="Export as JSON">
        <Download className="text-black" onClick={() => setOpen(!open)} />
      </Tooltip>

      <div
        className={cn(
          "absolute p-4 my-3 bg-white end-0 border-2 rounded-lg w-[25rem] flex flex-col items-start justify-center",
          !open && "hidden",
        )}
      >
        <label>File name:</label>
        <input
          className="w-[23rem] p-1 border rounded-md"
          type="text"
          placeholder="File name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <a
          className="self-end mt-2 no-underline text-black border rounded-md py-1 px-3 flex gap-2 hover:border-orange-600 transition"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data),
          )}`}
          download={`${fileName}.json`}
        >
          Export data <Download />
        </a>
      </div>
    </div>
  );
}

export default FileExport;
