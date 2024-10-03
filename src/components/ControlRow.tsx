import { replaceLink } from "../lib/helpers";

interface IControlRowProps {
  shortCode: string;
  description: string;
  requiredFrom: string;
  handleChecked: (shortcode: string) => void;
}

function ControlRow(props: IControlRowProps) {
  const { shortCode, description, requiredFrom, handleChecked } = props;
  const {textWithoutLink, linkText, link} = replaceLink(description);
  return (
    <div className="my-1 grid grid-cols-12 items-center rounded-lg px-2 bg-slate-200">
      <p>{shortCode}</p>
      <div className="col-span-8 text-left text-pretty">
      <p>{textWithoutLink}       {link && <a href={link} target="_blank">{linkText}</a>}
      </p>
      </div>
     
      <div className="flex col-span-2 gap-1 flex-col justify-center items-center">
        <span>Required from:</span>
        <span>{requiredFrom}</span>
      </div>
      <div className="flex gap-1 flex-col justify-center items-center">
        <input
          type="checkbox"
          className="w-4 h-4"
          onClick={() => handleChecked(shortCode)}
        />
        <label>Compliant</label>
      </div>
    </div>
  );
}

export default ControlRow;
