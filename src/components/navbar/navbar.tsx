import { Download } from "lucide-react";
import { useLocalStorage } from "../../lib/localStorageProvider";
import Modal from "../modal/modal";
import Tooltip from "../tooltip/tooltip";

function Navbar() {
  const { data, clearData } = useLocalStorage();
  return (
    <div id="banner" className="h-12 border-b-2 w-full ">
      <div className="max-w-screen-xl mx-auto flex gap-1 py-4 px-1 w-full h-full gap-4 px-6">
        <div className="grow items-center flex gap-1">
          <img
            src="/asvs-serviteur.svg"
            className="h-14"
            style={{ color: "red" }}
          />
          <h1>OWASP ASVS Serviteur</h1>
        </div>
        {data && <span className="shrink-0"> 📝{data.name}</span>}
        {data && <span className="shrink-0">🎯 Level {data.targetLevel}</span>}
        {data && (
          <Modal
            title="Do you really want to reset project?"
            text="This will remove all current progress and you will need to start new project from scratch. Make sure you did download the progress before proceeding!"
            onSubmit={() => clearData()}
          />
        )}
        {data && <div><Tooltip text="Export as JSON"><a  href={`data:text/json;charset=utf-8,${encodeURIComponent(
   JSON.stringify(data)
  )}`}
  download={`ASVS Audit - ${data.name}_${data.date && new Date(data.date).toLocaleDateString()}.json`}><Download className="text-black" onClick={() => {

        }} /></a></Tooltip></div>}
      </div>
    </div>
  );
}

export default Navbar;
