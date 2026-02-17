import { Check, Home, Printer, Shield, TriangleAlert, X } from "lucide-react";
import { cn, getLevelLabel, replaceLink } from "../../lib/helpers";
import { useLocalStorage } from "../../lib/localStorageProvider";
import {
  generateRadarChartData,
  getColorForResult,
  getFlatResultPerCategory,
  getPercent,
  getResultForCategories,
  getResultForLevel,
  getTotalScore,
} from "../../lib/reportHelpers";
import RadarChart from "./radarChart";

function Report() {
  const { data } = useLocalStorage();

  if (!data)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-lg rounded-2xl border border-red-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 text-red-600">
            <TriangleAlert size={32} />
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                No Data Available
              </h2>
              <p className="text-slate-600">
                Please create a{" "}
                <a href="/" className="text-orange-600 font-semibold">
                  project
                </a>{" "}
                first.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

  const results = getResultForLevel(data);
  const catResults = getResultForCategories(data);
  const totalScore = getTotalScore(results);
  const totalControls = results.length;
  const completionRate = parseFloat(getPercent(totalScore, totalControls));
  const failedControls = results.filter((r) => !r.checked && !r.NA).length;
  const naControls = results.filter((r) => r.NA).length;

  // Calculate risk areas (categories below 75%)
  const riskAreas = catResults
    .map((cat, idx) => {
      const flatResult = getFlatResultPerCategory(data)[idx];
      const percent = flatResult.total
        ? parseFloat(getPercent(flatResult.checked, flatResult.total))
        : 100;
      return { ...cat, percent, ...flatResult };
    })
    .filter((cat) => cat.percent < 75 && cat.total > 0)
    .sort((a, b) => a.percent - b.percent);

  const strongAreas = catResults
    .map((cat, idx) => {
      const flatResult = getFlatResultPerCategory(data)[idx];
      const percent = flatResult.total
        ? parseFloat(getPercent(flatResult.checked, flatResult.total))
        : 100;
      return { ...cat, percent, ...flatResult };
    })
    .filter((cat) => cat.percent >= 90 && cat.total > 0)
    .sort((a, b) => b.percent - a.percent);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block print:mb-6">
        <div className="flex items-center justify-between border-b-2 border-slate-300 pb-3">
          <div className="flex items-center gap-3">
            <Shield className="text-orange-600" size={36} />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                OWASP ASVS Security Audit Report
              </h1>
              <p className="text-xs text-slate-600">
                Application Security Verification Standard v5.0.0
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p>Generated: {new Date().toLocaleDateString()}</p>
            <p>Confidential</p>
          </div>
        </div>
      </div>

      <div className="relative isolate overflow-hidden print:overflow-visible">
        <div className="print:hidden pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200 via-amber-100 to-transparent opacity-80 blur-3xl" />
        <div className="print:hidden pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-slate-200 via-white to-transparent opacity-70 blur-3xl" />
        <div className="print:hidden absolute inset-0 bg-grid opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 2xl:max-w-[1440px] 2xl:px-10 3xl:max-w-none print:px-0 print:py-0 print:max-w-none">
          {/* Screen-only Header */}
          <header className="print:hidden flex flex-col gap-4 mb-8 animate-[reveal_700ms_ease-out]">
            <div className="flex items-center justify-between">
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
                  onClick={() => window.print()}
                  className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-700 flex items-center gap-2"
                >
                  <Printer size={16} />
                  <span className="hidden sm:inline">Print Report</span>
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Security Audit Report
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
                {data.name}
              </h2>
            </div>
          </header>
          {/* Executive Summary */}
          <section className="mb-6 print:mb-8">
            <div className="mb-4">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 print:text-xl">
                Executive Summary
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-400"></div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:border-slate-300 print:shadow-none print:p-3">
              <div className="mb-3">
                <h3 className="mb-2 text-lg font-semibold text-slate-900 print:text-base">
                  Project: {data.name}
                </h3>
                <div className="text-sm text-slate-600 space-y-1 print:text-xs">
                  <p>
                    <strong>Target Level:</strong> L{data.targetLevel} |{" "}
                    <strong>Audit Date:</strong>{" "}
                    {new Date(data.date).toLocaleDateString()} |{" "}
                    <strong>Total Controls:</strong> {totalControls}
                  </p>
                  <p>
                    <strong
                      className={getColorForResult(totalScore, totalControls)}
                    >
                      Overall Compliance: {completionRate.toFixed(1)}%
                    </strong>{" "}
                    ({totalScore}/{totalControls}) •
                    <span className="text-emerald-700 font-semibold">
                      {totalScore} Compliant
                    </span>{" "}
                    •
                    <span className="text-red-700 font-semibold">
                      {failedControls} Non-Compliant
                    </span>{" "}
                    •<span className="text-slate-600">{naControls} N/A</span>
                  </p>
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="border-l-4 border-amber-400 bg-amber-50 p-3 print:p-2">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-900 print:text-xs">
                  <TriangleAlert size={16} />
                  Key Recommendations
                </h4>
                <div className="text-xs text-amber-900 space-y-1 print:text-[10px]">
                  {completionRate < 50 && (
                    <p>
                      <strong>Critical:</strong> Overall compliance below 50%.
                      Immediate remediation required.
                    </p>
                  )}
                  {riskAreas.length > 0 && (
                    <p>
                      <strong>Priority:</strong> Focus on{" "}
                      {riskAreas
                        .slice(0, 3)
                        .map((r) => r.shortcode)
                        .join(", ")}{" "}
                      (lowest compliance).
                    </p>
                  )}
                  {failedControls > 0 && (
                    <p>
                      <strong>Action:</strong> {failedControls} control
                      {failedControls > 1 ? "s" : ""} require
                      {failedControls === 1 ? "s" : ""} remediation.
                    </p>
                  )}
                  {strongAreas.length > 0 && (
                    <p>
                      <strong>Strengths:</strong>{" "}
                      {strongAreas
                        .slice(0, 3)
                        .map((r) => r.shortcode)
                        .join(", ")}{" "}
                      show excellent compliance.
                    </p>
                  )}
                  {completionRate >= 90 && (
                    <p>
                      <strong>Excellent:</strong> Strong security posture with
                      90%+ compliance.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Visual Overview */}
          <section className="mb-6 print:mb-8 print:page-break-before">
            <div className="mb-4">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 print:text-xl">
                Compliance Overview
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-400"></div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 print:gap-3">
              {/* Radar Chart */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:border-slate-300 print:shadow-none print:p-3">
                <h3 className="mb-3 text-base font-semibold text-slate-900 print:text-sm">
                  Category Distribution
                </h3>
                <div className="mx-auto max-w-sm print:max-w-xs">
                  <RadarChart data={generateRadarChartData(data)} />
                </div>
              </div>

              {/* Category Summary Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm print:border-slate-300 print:shadow-none print:p-3">
                <h3 className="mb-3 text-base font-semibold text-slate-900 print:text-sm">
                  Category Scores
                </h3>
                <div className="space-y-2 print:space-y-1">
                  {catResults.map((cat, idx) => {
                    const flatResult = getFlatResultPerCategory(data)[idx];
                    if (flatResult.total === 0) return null;
                    const percent = parseFloat(
                      getPercent(flatResult.checked, flatResult.total),
                    );
                    return (
                      <div
                        key={cat.shortcode}
                        className="flex items-center justify-between rounded-lg border border-slate-100 p-2 print:p-1.5"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 print:text-xs">
                              {cat.shortcode}
                            </span>
                            <span className="text-xs text-slate-600 truncate print:text-[10px]">
                              {cat.name}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 print:h-1">
                            <div
                              className={cn(
                                "h-full transition-all",
                                percent >= 90
                                  ? "bg-emerald-500"
                                  : percent >= 75
                                    ? "bg-lime-500"
                                    : percent >= 50
                                      ? "bg-amber-500"
                                      : "bg-red-500",
                              )}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                        <div className="ml-3 text-right flex-shrink-0">
                          <div
                            className={cn(
                              "text-sm font-bold print:text-xs",
                              getColorForResult(
                                flatResult.checked,
                                flatResult.total,
                              ),
                            )}
                          >
                            {percent.toFixed(0)}%
                          </div>
                          <div className="text-[10px] text-slate-500 print:text-[9px]">
                            {flatResult.checked}/{flatResult.total}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
          {/* Detailed Category Breakdown */}
          <section className="mb-6 print:mb-8 print:page-break-before">
            <div className="mb-4">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 print:text-xl">
                Category Details
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-400"></div>
            </div>

            <div className="space-y-3 print:space-y-2">
              {catResults
                .filter(
                  (cat) =>
                    cat.items.filter((item) => item.total !== 0).length !== 0,
                )
                .map((cat) => {
                  const flatResult =
                    getFlatResultPerCategory(data)[catResults.indexOf(cat)];
                  const overallPercent = flatResult.total
                    ? parseFloat(
                        getPercent(flatResult.checked, flatResult.total),
                      )
                    : 100;
                  return (
                    <div
                      key={cat.shortcode}
                      className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur print:border-slate-300 print:shadow-none print:break-inside-avoid print:p-3"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-slate-900 print:text-sm">
                              {cat.shortcode}
                            </span>
                            <span className="text-sm text-slate-600 print:text-xs">
                              {cat.name}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 print:h-1.5">
                              <div
                                className={cn(
                                  "h-full transition-all",
                                  overallPercent >= 90
                                    ? "bg-emerald-500"
                                    : overallPercent >= 75
                                      ? "bg-lime-500"
                                      : overallPercent >= 50
                                        ? "bg-amber-500"
                                        : "bg-red-500",
                                )}
                                style={{ width: `${overallPercent}%` }}
                              />
                            </div>
                            <span
                              className={cn(
                                "text-sm font-bold min-w-[60px] text-right print:text-xs",
                                getColorForResult(
                                  flatResult.checked,
                                  flatResult.total,
                                ),
                              )}
                            >
                              {flatResult.checked}/{flatResult.total} (
                              {overallPercent.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 print:grid-cols-4 print:gap-1.5">
                        {cat.items
                          .filter((item) => item.total !== 0)
                          .map((item) => {
                            const percent = parseFloat(
                              getPercent(item.checked, item.total),
                            );
                            return (
                              <div
                                key={item.shortcode}
                                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-2 py-1.5 print:px-1.5 print:py-1"
                              >
                                <span
                                  className={cn(
                                    "text-xs font-medium print:text-[10px]",
                                    getColorForResult(item.checked, item.total),
                                  )}
                                >
                                  {item.shortcode}
                                </span>
                                <span
                                  className={cn(
                                    "text-[10px] ml-1 print:text-[9px]",
                                    getColorForResult(item.checked, item.total),
                                  )}
                                >
                                  {percent.toFixed(0)}%
                                </span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Detailed Controls Table */}
          <section className="mb-6 print:page-break-before">
            <div className="mb-4">
              <h2 className="mb-2 text-2xl font-bold text-slate-900 print:text-xl">
                Detailed Findings
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-400"></div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur print:border-slate-300 print:shadow-none">
              <div className="overflow-auto">
                <table className="w-full border-collapse text-xs print:text-[10px]">
                  <thead className="border-b-2 border-slate-300 bg-slate-50">
                    <tr>
                      <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-700 print:px-1 print:py-1 print:text-[9px] w-[80px]">
                        ID
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-700 print:px-1 print:py-1 print:text-[9px]">
                        Description
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-700 print:px-1 print:py-1 print:text-[9px] w-[60px]">
                        Lvl
                      </th>
                      <th className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-700 print:px-1 print:py-1 print:text-[9px] w-[70px]">
                        Status
                      </th>
                      <th className="px-2 py-2 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-700 print:px-1 print:py-1 print:text-[9px] w-[150px]">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.map((r) => (
                      <tr
                        key={r.Shortcode}
                        className="hover:bg-slate-50 print:hover:bg-transparent"
                      >
                        <td className="px-2 py-2 font-mono text-xs font-medium text-slate-900 print:px-1 print:py-1 print:text-[9px] align-top">
                          <div className="whitespace-nowrap">{r.shortcode}</div>
                        </td>
                        <td className="px-2 py-2 text-xs text-slate-700 print:px-1 print:py-1 print:text-[9px] align-top">
                          <div className="break-words word-wrap overflow-wrap-anywhere hyphens-auto">
                            {replaceLink(r.Description).textWithoutLink}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-center text-xs text-slate-700 print:px-1 print:py-1 print:text-[9px] align-top">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 print:px-1 print:text-[8px] whitespace-nowrap">
                            {getLevelLabel(r)}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center print:px-1 print:py-1 align-top">
                          <div className="whitespace-nowrap">
                            {r.NA ? (
                              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700 print:px-1 print:text-[8px]">
                                N/A
                              </span>
                            ) : r.checked || r.partial ? (
                              <div className="flex items-center justify-center">
                                <Check
                                  className="text-emerald-600 print:w-3 print:h-3"
                                  size={16}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <X
                                  className="text-red-600 print:w-3 print:h-3"
                                  size={16}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-2 text-xs text-slate-600 print:px-1 print:py-1 print:text-[9px] align-top">
                          {r.note && r.note.length > 0 ? (
                            <div className="break-words word-wrap overflow-wrap-anywhere hyphens-auto">
                              {r.note}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-500 print:mt-6 print:text-[10px]">
            <p>This report was generated using OWASP ASVS Serviteur</p>
            <p className="mt-0.5">
              OWASP Application Security Verification Standard (ASVS) v5.0.0
            </p>
            <p className="mt-0.5">
              Report generated on {new Date().toLocaleString()}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Report;
