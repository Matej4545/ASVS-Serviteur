import {
  Home,
  NotebookPen,
  Printer,
  Shield,
  TriangleAlert,
} from "lucide-react";
import {
  cn,
  filterAsvsByLevel,
  findAuditRes,
  replaceLink,
} from "../../lib/helpers";
import { useLocalStorage } from "../../lib/localStorageProvider";
import {
  generateRadarChartData,
  getFlatResultPerCategory,
  getPercent,
  getResultForCategories,
  getResultForLevel,
  getTotalScore,
} from "../../lib/reportHelpers";
import RadarChart from "./radarChart";

function Report2() {
  const { data, loading } = useLocalStorage();

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        loading
      </div>
    );
  if (!data)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-lg rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-red-600">
            <TriangleAlert size={32} />
            <div>
              <h2 className="text-lg font-semibold text-red-900">
                No Data Available
              </h2>
              <p className="text-red-700 text-sm">
                Please create a{" "}
                <a href="/" className="font-semibold underline">
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
  const partialControls = results.filter((r) => r.partial && !r.NA).length;

  // Determine compliance rating
  const getComplianceRating = (percent: number) => {
    if (percent >= 90)
      return {
        label: "Excellent",
        color: "text-emerald-700 bg-emerald-50",
        border: "border-emerald-200",
      };
    if (percent >= 75)
      return {
        label: "Good",
        color: "text-blue-700 bg-blue-50",
        border: "border-blue-200",
      };
    if (percent >= 50)
      return {
        label: "Fair",
        color: "text-amber-700 bg-amber-50",
        border: "border-amber-200",
      };
    return {
      label: "Needs Improvement",
      color: "text-red-700 bg-red-50",
      border: "border-red-200",
    };
  };

  const rating = getComplianceRating(completionRate);

  const findingsByCategory = filterAsvsByLevel(data.targetLevel)
    .map((category) => ({
      shortcode: category.Shortcode,
      name: category.Name,
      controls: category.Items.flatMap((subCategory) =>
        subCategory.Items.map((control) => ({
          ...control,
          ...findAuditRes(data.results, control.Shortcode),
        })),
      ).filter((control) => !control.NA),
    }))
    .filter((category) => category.controls.length > 0);

  const getCategoryAnchor = (shortcode: string) =>
    `category-${shortcode.toLowerCase()}`;

  const getControlStatus = (control: {
    checked?: boolean;
    partial?: boolean;
    NA?: boolean;
  }) => {
    if (control.NA) {
      return {
        label: "N/A",
        className: "bg-slate-100 text-slate-700",
      };
    }
    if (control.checked) {
      return {
        label: "Compliant",
        className: "bg-emerald-100 text-emerald-700",
      };
    }
    if (control.partial) {
      return {
        label: "Partial",
        className: "bg-amber-100 text-amber-700",
      };
    }
    return {
      label: "Non-Compliant",
      className: "bg-red-100 text-red-700",
    };
  };

  // Get rating badge for a category
  const getCategoryRating = (percent: number) => {
    if (percent >= 90)
      return { label: "A", color: "bg-emerald-100 text-emerald-700" };
    if (percent >= 75)
      return { label: "B", color: "bg-blue-100 text-blue-700" };
    if (percent >= 50)
      return { label: "C", color: "bg-amber-100 text-amber-700" };
    if (percent >= 25)
      return { label: "D", color: "bg-orange-100 text-orange-700" };
    return { label: "E", color: "bg-red-100 text-red-700" };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans max-w-[1440px] mx-auto">
      {/* Screen Header */}
      <header className="print:hidden sticky top-0 bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={28} className="text-slate-900" />
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                ASVS Security Audit Report
              </h1>
              <p className="text-xs text-slate-600">{data.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 no-underline"
            >
              <Home size={16} />
              <span className="hidden sm:inline">Home</span>
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 flex items-center gap-2"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-1 print:py-1 print:max-w-none">
        {/* Print Header */}
        <div className="hidden print:block mb-8 pb-6 border-b-2 border-slate-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <Shield className="text-slate-900 mt-1" size={40} />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Security Audit Report
                </h1>
                <p className="text-sm text-slate-600 mt-1">OWASP ASVS v5.0.0</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600">
                Generated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-slate-600 mt-1">Confidential</p>
            </div>
          </div>
        </div>

        {/* Executive Summary & Rating Section */}
        <section className="mb-8 print:mb-6 print:page-break-after-avoid">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900 print:text-xl">
              Executive Summary
            </h2>
            <div className="h-1 w-16 bg-slate-900 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 print:grid-cols-3 print:gap-3">
            {/* Application Info Card */}
            <div className="lg:col-span-2 print:col-span-2 bg-white rounded-lg border border-slate-200 p-6 print:p-4">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-4 print:text-xs print:mb-3">
                Application Details
              </h3>
              <div className="space-y-3 print:space-y-2">
                <div>
                  <p className="text-xs text-slate-600 uppercase tracking-wide print:text-[10px]">
                    Project Name
                  </p>
                  <p className="text-lg font-semibold text-slate-900 print:text-base">
                    {data.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 print:gap-3">
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide print:text-[10px]">
                      Target Level
                    </p>
                    <p className="text-base font-semibold text-slate-900 print:text-sm">
                      Level {data.targetLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide print:text-[10px]">
                      Audit Date
                    </p>
                    <p className="text-base font-semibold text-slate-900 print:text-sm">
                      {new Date(data.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-200">
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide print:text-[10px]">
                      Compliant
                    </p>
                    <p className="text-sm font-bold text-emerald-700 print:text-xs">
                      {totalScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide print:text-[10px]">
                      Non-Compliant
                    </p>
                    <p className="text-sm font-bold text-red-700 print:text-xs">
                      {failedControls}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase tracking-wide print:text-[10px]">
                      Partial
                    </p>
                    <p className="text-sm font-bold text-amber-700 print:text-xs">
                      {partialControls}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance Rating Card */}
            <div
              className={cn(
                "rounded-lg border p-6 print:p-4",
                rating.border,
                rating.color,
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-2 print:text-[10px]">
                Compliance Rating
              </p>
              <div className="flex items-baseline gap-2 mb-4 print:mb-3">
                <span className="text-3xl font-bold print:text-2xl">
                  {completionRate.toFixed(1)}%
                </span>
                <span className="text-sm font-semibold print:text-xs">
                  {rating.label}
                </span>
              </div>
              <p className="text-xs print:text-[10px] opacity-80">
                {totalScore} of {totalControls} controls
              </p>
            </div>
          </div>
        </section>

        {/* Radar Chart & Category Table Section */}
        <section className="mb-8 print:mb-6 print:page-break-before">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900 print:text-xl">
              Result Overview
            </h2>
            <div className="h-1 w-16 bg-slate-900 mt-2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
            {/* Radar Chart */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 print:p-4 w-full">
              <h3 className="text-base font-semibold text-slate-900 mb-4 print:text-sm print:mb-3">
                Compliance Distribution
              </h3>
              <div className="w-full my-auto print:w-[300px] print:h-[300px] print:mx-auto">
                <RadarChart data={generateRadarChartData(data)} />
              </div>
            </div>

            {/* Category Table */}
            <div className="bg-white rounded-lg w-full overflow-hidden">
              <div className="">
                <table className="text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-slate-700 print:px-2 print:py-2">
                        ASVS Chapter
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-slate-700 w-12 print:px-1 print:py-2">
                        Rating
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-slate-700 w-16 print:px-1 print:py-2">
                        Passed
                      </th>
                      <th className="px-3 py-3 text-center font-semibold text-slate-700 w-16 print:px-1 print:py-2">
                        Failed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {catResults.map((cat, idx) => {
                      const flatResult = getFlatResultPerCategory(data)[idx];
                      if (flatResult.total === 0) return null;

                      const percent = parseFloat(
                        getPercent(flatResult.checked, flatResult.total),
                      );
                      const catRating = getCategoryRating(percent);

                      return (
                        <tr
                          key={cat.shortcode}
                          className="hover:bg-slate-50 print:hover:bg-transparent"
                        >
                          <td className="px-4 py-1 print:px-2 print:py-1 print:text-[11px] ">
                            <a
                              href={`#${getCategoryAnchor(cat.shortcode)}`}
                              className="font-semibold text-slate-900 hover:underline"
                            >
                              {cat.shortcode}: {cat.name}
                            </a>
                            <div className="text-xs text-slate-600 print:text-[10px]"></div>
                          </td>
                          <td className="px-3 py-1 text-center print:px-1 print:py-1">
                            <span
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm print:w-6 print:h-6 print:text-xs ${catRating.color}`}
                            >
                              {catRating.label}
                            </span>
                          </td>
                          <td className="px-3 py-1 text-center text-emerald-700 font-semibold print:px-1 print:py-1">
                            {flatResult.checked}
                          </td>
                          <td className="px-3 py-1 text-center text-red-700 font-semibold print:px-1 print:py-1">
                            {flatResult.total - flatResult.checked}
                          </td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 font-bold">
                      <td className="px-4 py-3 print:px-2 print:py-2">
                        Total ASVS Rating
                      </td>
                      <td className="px-3 py-3 text-center print:px-1 print:py-2">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm print:w-6 print:h-6 print:text-xs ${getCategoryRating(completionRate).color}`}
                        >
                          {getCategoryRating(completionRate).label}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-emerald-700 print:px-1 print:py-2">
                        {totalScore}
                      </td>
                      <td className="px-3 py-3 text-center text-red-700 print:px-1 print:py-2">
                        {failedControls}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Rating Legend */}
              </div>
              <div className="bg-slate-50 px-4 py-3 print:px-2 print:py-2">
                <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 print:text-[10px]">
                  Rating Legend
                </p>
                <div className="grid grid-cols-5 gap-2 print:gap-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      A
                    </span>
                    <span className="text-xs text-slate-600 print:text-[10px]">
                      90%+
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      B
                    </span>
                    <span className="text-xs text-slate-600 print:text-[10px]">
                      75%+
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                      C
                    </span>
                    <span className="text-xs text-slate-600 print:text-[10px]">
                      50%+
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                      D
                    </span>
                    <span className="text-xs text-slate-600 print:text-[10px]">
                      25%+
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                      E
                    </span>
                    <span className="text-xs text-slate-600 print:text-[10px]">
                      &lt;25%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Findings by Category */}
        <section className="mb-8 print:mb-6 print:page-break-before">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900 print:text-xl">
              Detailed Findings
            </h2>
            <div className="h-1 w-16 bg-slate-900 mt-2" />
          </div>

          <div className="space-y-6 print:space-y-4">
            {findingsByCategory.map((category) => {
              const categoryCompliant = category.controls.filter(
                (control) => control.checked || control.partial,
              ).length;
              const categoryTotal = category.controls.length;
              const categoryComplianceRate =
                categoryTotal > 0
                  ? parseFloat(getPercent(categoryCompliant, categoryTotal))
                  : 100;

              return (
                <div
                  key={category.shortcode}
                  id={getCategoryAnchor(category.shortcode)}
                  className="print:page-break-inside-avoid scroll-mt-24"
                >
                  <div className="mb-3 pb-3 border-b border-slate-200 print:mb-2 print:pb-2">
                    <h3 className="text-lg font-semibold text-slate-900 print:text-base">
                      {category.shortcode}: {category.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 print:text-[11px]">
                      {categoryCompliant} of {categoryTotal} controls compliant
                      ({categoryComplianceRate.toFixed(0)}%)
                    </p>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 max-w-full overflow-x-auto print:overflow-visible">
                    <table className="w-full text-sm table-fixed">
                      <colgroup>
                        <col className="w-24" />
                        <col />
                        <col className="w-36" />
                      </colgroup>
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700 print:px-2 print:py-1.5">
                            Shortcode
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700 print:px-2 print:py-1.5">
                            Description
                          </th>
                          <th className="px-4 py-2 text-left font-semibold text-slate-700 print:px-2 print:py-1.5">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {category.controls.map((control) => {
                          const status = getControlStatus(control);

                          return (
                            <tr
                              key={`${control.Shortcode}-main`}
                              className="align-top"
                            >
                              <td className="px-4 py-2 font-mono font-semibold text-xs text-slate-900 print:px-2 print:py-1.5 print:text-[10px]">
                                <div className="flex flex-col">
                                  {control.Shortcode}
                                  <div className="bg-slate-100 p-1 my-1 w-fit rounded-lg">
                                    L{control.L}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-2 text-slate-700 text-wrap break-words leading-snug print:px-2 print:py-1.5 print:text-[11px]">
                                <div className="flex flex-col">
                                  <span>
                                    {
                                      replaceLink(control.Description)
                                        .textWithoutLink
                                    }
                                  </span>
                                  <span className="font-light mt-2">
                                    {control.note &&
                                      control.note.length > 0 && (
                                        <div className="inline-flex gap-2 items-center text-slate-500">
                                          <NotebookPen width={16} />
                                          {control.note}
                                        </div>
                                      )}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2 print:px-2 print:py-1.5">
                                <span
                                  className={cn(
                                    "inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold print:text-[10px]",
                                    status.className,
                                  )}
                                >
                                  {status.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200 text-center text-xs text-slate-600 print:mt-6 print:pt-4 print:text-[10px]">
          <p className="font-semibold mb-1">Confidential Assessment Report</p>
          <p>
            Generated by OWASP ASVS Serviteur | {new Date().toLocaleString()}
          </p>
          <p className="mt-1">
            Based on OWASP Application Security Verification Standard (ASVS)
            v5.0.0
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Report2;
