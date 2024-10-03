import { RotateCw } from "lucide-react";
import { useState } from "react";
import Collapsible from "./components/Collapsible";
import ControlRow from "./components/ControlRow";
import Navbar from "./components/navbar/navbar";
import Progress from "./components/progress/Progress";
import { filterAsvsByLevel, getInitialProgress, getLevelLabel, GetNumberOfActiveControls } from "./lib/helpers";

function App() {
  const [level, setLevel] = useState(1);
  const [controls, setControls] = useState(filterAsvsByLevel(level));
  const [progress, setProgress] = useState(getInitialProgress());

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
                  (p) => p.Shortcode.startsWith(c.Shortcode) && p.Checked
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

  function handleChecked(Shortcode: string): void {
    setProgress(
      progress.map((p) => {
        if (p.Shortcode == Shortcode) {
          return { Shortcode: Shortcode, Checked: !p.Checked };
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
        shortCode={i.Shortcode}
        description={i.Description}
        requiredFrom={getLevelLabel(i)}
        handleChecked={handleChecked}
      />
    ));
  }
  return (
    <>
      <Navbar
        handleLevelSelect={(level) => {
          setLevel(level);
          setControls(filterAsvsByLevel(level));
        }}
      />
      <main>
        <div className="container mx-auto">
          <div className="w-10/12 mx-auto flex gap-2 items-center">
            <span>Total progress:</span>
            <Progress
              className="grow"
              total={GetNumberOfActiveControls(controls)}
              completed={progress.filter((p) => p.Checked).length}
              showNumbers
            />
            <RotateCw className="text-red-600 hover:rotate-45 transition" onClick={() => setProgress(getInitialProgress())}/>
          </div>
          {controls.map((r) => (
            formatCategories(r.Items)
          ))}
        </div>
      </main>
    </>
  );
}


export default App;


