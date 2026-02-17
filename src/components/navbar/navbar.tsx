import { Download, Home, RotateCw, Scroll } from "lucide-react";
import { useLocalStorage } from "../../lib/localStorageProvider";
import { useState } from "react";

function Navbar() {
  const { clearData, data, updateResults } = useLocalStorage();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFileName, setExportFileName] = useState(
    `ASVS Audit - ${data?.name}_${data?.date && new Date(data.date).toLocaleDateString()}`,
  );

  function handleRandomFill(): void {
    if (!data) return;

    const completionTarget = 0.8;
    const partialRate = 0.15;
    const randomResults = data.results.map((result) => {
      const isDone = Math.random() < completionTarget;
      if (!isDone) {
        return {
          ...result,
          checked: false,
          partial: false,
          NA: false,
          note: "",
        };
      }

      const isPartial = Math.random() < partialRate;
      return {
        ...result,
        checked: !isPartial,
        partial: isPartial,
        NA: false,
      };
    });

    updateResults(randomResults);
  }

  return (
    <div className="print:hidden relative max-w-7xl 2xl:max-w-[1440px] 2xl:px-10 3xl:max-w-none px-4 pb-12 pt-8 mx-auto flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src="./asvs-serviteur.svg"
          className="h-10"
          alt="ASVS Serviteur Logo"
        />
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            OWASP ASVS Serviteur
          </h1>
          <a
            href="https://github.com/OWASP/ASVS/tree/master/5.0"
            target="_blank"
            className="text-xs text-slate-500 no-underline hover:text-slate-700"
          >
            Using ASVS v5.0.0
          </a>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-orange-300 flex items-center gap-2 no-underline"
        >
          <Home size={16} />
          <span className="hidden sm:inline">Home</span>
        </a>
        <button
          onClick={() => setShowExportDialog(!showExportDialog)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-orange-300 flex items-center gap-2"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Export</span>
        </button>
        {data && (
          <button
            onClick={handleRandomFill}
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:border-amber-300 hover:bg-amber-100 flex items-center gap-2"
          >
            <span className="hidden sm:inline">Random 80%</span>
            <span className="sm:hidden">80%</span>
          </button>
        )}
        <a
          href="?report=true"
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-orange-300 flex items-center gap-2 no-underline"
        >
          <Scroll size={16} />
          <span className="hidden sm:inline">Report</span>
        </a>
        <button
          onClick={() => setShowResetModal(true)}
          className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 hover:border-red-400 hover:bg-red-50 flex items-center gap-2"
        >
          <RotateCw size={16} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowResetModal(false)}
          />
          <div className="relative mx-auto my-6 w-auto max-w-3xl">
            <div className="relative flex w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-xl outline-none focus:outline-none">
              <div className="flex items-start justify-between rounded-t border-b border-slate-200 p-5">
                <h3 className="text-2xl font-semibold text-slate-900">
                  Reset Project?
                </h3>
              </div>
              <div className="relative flex-auto p-6">
                <p className="my-4 text-lg leading-relaxed text-slate-600">
                  This will remove all current progress and you will need to
                  start a new project from scratch. Make sure you have
                  downloaded the progress before proceeding!
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 rounded-b border-t border-slate-200 p-6">
                <button
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  type="button"
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                  type="button"
                  onClick={() => {
                    clearData();
                    setShowResetModal(false);
                  }}
                >
                  Reset Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowExportDialog(false)}
          />
          <div className="relative mx-auto my-6 w-auto max-w-lg">
            <div className="relative flex w-full flex-col rounded-2xl border border-slate-200 bg-white shadow-xl outline-none focus:outline-none">
              <div className="flex items-start justify-between rounded-t border-b border-slate-200 p-5">
                <h3 className="text-xl font-semibold text-slate-900">
                  Export Audit Data
                </h3>
              </div>
              <div className="relative flex-auto p-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  File name:
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:border-orange-400 focus:outline-none"
                  type="text"
                  placeholder="File name"
                  value={exportFileName}
                  onChange={(e) => setExportFileName(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-3 rounded-b border-t border-slate-200 p-6">
                <button
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  type="button"
                  onClick={() => setShowExportDialog(false)}
                >
                  Cancel
                </button>
                <a
                  className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 no-underline"
                  href={`data:text/json;charset=utf-8,${encodeURIComponent(
                    JSON.stringify(data),
                  )}`}
                  download={`${exportFileName}.json`}
                  onClick={() => setShowExportDialog(false)}
                >
                  <Download size={16} />
                  Export Data
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
