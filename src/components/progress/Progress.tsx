import { cn } from "../../lib/helpers";

interface IProgressProps {
  total: number;
  completed: number;
  className?: string;
  showNumbers?: boolean;
}

function Progress(props: IProgressProps) {
  const { total, completed, className, showNumbers } = props;
  const progressInPercent = Math.round(( completed / total)*100);
  const wrapperCN = cn("flex gap-1 items-center", className)
  return (
    <div className={wrapperCN}>
      <div className="h-4 w-full bg-slate-200 rounded-full m-2 overflow-hidden	grow">
        <div
          className={`h-full bg-green-500 text-right flex items-center`}
          style={{ width: `${progressInPercent}%` }}
        >
          <p className="text-white text-sm px-2 ms-auto">{progressInPercent}%</p>
        </div>
      </div>
      {showNumbers && <div className="shrink-0">
        {completed} / {total}
      </div>}
    </div>
  );
}

export default Progress;
