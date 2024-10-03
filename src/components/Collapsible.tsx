import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";

interface ICollapsibleProps {
  title: string;
  openOnLoad?: boolean;
  children?: ReactNode;
  progressComponent? : ReactNode;
}
function Collapsible(props: ICollapsibleProps) {
  const { title, children, openOnLoad, progressComponent } = props;
  const [open, setOpen] = useState(openOnLoad);

  const toggleOpen = () => setOpen((cur) => !cur);
  return (
    <div className="w-full border rounded-md my-2 ps-4 p-1">
      <div className="flex items-center">
        <h2 className="grow">{title}</h2>
        {progressComponent}
        <button
          className="grow-0 shrink-0 hover:text-orange-600 transition m-1"
          onClick={toggleOpen}
        >
            {open ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <div className="w-full m-2" style={{ display: open ? "unset" : "none" }}>
        {children}
      </div>
    </div>
  );
}

export default Collapsible;
