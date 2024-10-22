import { ReactNode } from "react";

interface ITooltipProps {
  text: string;
  children: ReactNode;
}

function Tooltip(props: ITooltipProps) {
  const { text, children } = props;
  return (
    <div className="group relative flex justify-center max-w-32">
      {children}
      <span className="absolute top-8 z-10 scale-0 transition-all rounded bg-gray-800 p-2 text-xs text-white group-hover:scale-100">
        {text}
      </span>
    </div>
  );
}

export default Tooltip;
