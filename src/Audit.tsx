import { useEffect, useState } from "react";
import Collapsible from "./components/Collapsible";
import ControlRow from "./components/ControlRow";
import Progress from "./components/progress/Progress";
import {
    filterAsvsByLevel,
    getInitialResults,
    getLevelLabel,
    GetNumberOfActiveControls,
} from "./lib/helpers";
import { useLocalStorage } from "./lib/localStorageProvider";
import { ASVSAuditResult } from "./types/types";

function Audit() {
  const { data, updateResults } = useLocalStorage();
  const controls = filterAsvsByLevel((data && data.targetLevel) || 3);
  const [progress, setProgress] = useState(
    data ? data.results : getInitialResults()
  );

  useEffect(() => {
    updateResults(progress as ASVSAuditResult[]);
  }, [progress]);

  function formatCategories(categories: any[]) {
    return categories
      .filter((c) => c.Items.length != 0)
      .map((c) => (
        <Collapsible
          title={`${c.Shortcode} - ${c.Name}`}
          key={c.Shortcode}
          progressComponent={
            <Progress
              total={c.Items.length}
              completed={
                progress.filter(
                  (p) => p.shortcode.startsWith(c.Shortcode) && p.checked
                ).length
              }
              className="w-1/4"
              showNumbers
            />
          }
        >
          {formatItems(c.Items)}
        </Collapsible>
      ));
  }

  function handleChecked(shortcode: string): void {
    setProgress(
      progress.map((p) => {
        if (p.shortcode == shortcode) {
          return { ...p, checked: !p.checked };
        } else {
          return p;
        }
      })
    );
  }

  function handleNote(shortcode: string, note: string): void {
    setProgress(
      progress.map((p) => {
        if (p.shortcode == shortcode) {
          return { ...p, note: note };
        } else {
          return p;
        }
      })
    );
  }

  function formatItems(items: any[]) {
    return items.map((i) => (
      <ControlRow
        key={i.Shortcode}
        initialChecked={
          progress.find((p) => p.shortcode === i.Shortcode)!.checked
        }
        shortCode={i.Shortcode}
        description={i.Description}
        requiredFrom={getLevelLabel(i)}
        initialNotes={progress.find((p) => p.shortcode === i.Shortcode)!.note}
        handleChecked={handleChecked}
        handleNote={(note) => handleNote(i.Shortcode, note)}
        cwe={i.CWE}
        nist={i.NIST}
      />
    ));
  }
  return (
    <div className="container mx-auto">
      <div className="w-10/12 mx-auto flex gap-2 items-center">
        <span>Total progress:</span>
        <Progress
          className="grow"
          total={GetNumberOfActiveControls(controls)}
          completed={progress.filter((p) => p.checked).length}
          showNumbers
        />
      </div>
      {controls.map((r) => <div><h1 className="ps-3 pt-3 text-orange-500">{r.Shortcode} - {r.ShortName}</h1>{formatCategories(r.Items)}</div>)}
    </div>
  );
}

export default Audit;
