import { Download, Home, RotateCw, Scroll } from "lucide-react";
import { useEffect, useState } from "react";
import ControlRow from "./components/ControlRow";
import {
  filterAsvsByLevel,
  findAuditRes,
  getInitialResults,
  getLevelLabel,
} from "./lib/helpers";
import { useLocalStorage } from "./lib/localStorageProvider";
import { ASVSAuditResult } from "./types/types";

function Audit() {
  const { data, updateResults, clearData } = useLocalStorage();
  const controls = filterAsvsByLevel((data && data.targetLevel) || 3);
  const [progress, setProgress] = useState(
    data ? data.results : getInitialResults(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    updateResults(progress as ASVSAuditResult[]);
  }, [progress]);

  function handleStatusChange(
    shortcode: string,
    status: "compliant" | "noncompliant" | "partial" | "na",
  ): void {
    setProgress(
      progress.map((p) => {
        if (p.shortcode === shortcode) {
          return {
            ...p,
            checked: status === "compliant",
            partial: status === "partial",
            NA: status === "na",
          };
        }
        return p;
      }),
    );
  }

  function handleNote(shortcode: string, note: string): void {
    setProgress(
      progress.map((p) => {
        if (p.shortcode === shortcode) {
          return { ...p, note: note };
        }
        return p;
      }),
    );
  }

  function handleBulkAction(
    categoryShortcode: string,
    action: "compliant" | "na" | "clear",
  ): void {
    setProgress(
      progress.map((p) => {
        if (p.shortcode.startsWith(categoryShortcode)) {
          if (action === "compliant") {
            return { ...p, checked: true, partial: false, NA: false };
          } else if (action === "na") {
            return { ...p, checked: false, partial: false, NA: true };
          } else {
            return { ...p, checked: false, partial: false, NA: false };
          }
        }
        return p;
      }),
    );
  }

  function getCategoryProgress(items: any[]) {
    const total = items.filter(
      (c: any) => !findAuditRes(progress, c.Shortcode)?.NA,
    ).length;
    const completed = items.filter(
      (c: any) =>
        !findAuditRes(progress, c.Shortcode)?.NA &&
        (findAuditRes(progress, c.Shortcode)?.checked ||
          findAuditRes(progress, c.Shortcode)?.partial),
    ).length;
    return { total, completed };
  }

  const totalControls = controls.reduce(
    (acc, cat) =>
      (acc += cat.Items.reduce(
        (acc, c) =>
          (acc += c.Items.filter(
            (c: any) => !findAuditRes(progress, c.Shortcode)?.NA,
          ).length),
        0,
      )),
    0,
  );

  const completedControls = progress.filter(
    (p) => (p.checked || p.partial) && !p.NA,
  ).length;

  const unansweredControls = progress.filter(
    (p) => !p.checked && !p.partial && !p.NA,
  ).length;

  const categoriesWithProgress = controls.flatMap((req) =>
    req.Items.filter((c) => c.Items.length > 0).map((cat) => {
      const allItems = cat.Items;
      const catProgress = getCategoryProgress(allItems);
      return {
        shortcode: cat.Shortcode,
        name: cat.Name,
        progress: catProgress,
      };
    }),
  );

  return (
    <>
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 2xl:max-w-[1440px] 2xl:px-10 3xl:max-w-none">
        <header className="flex flex-col gap-6 animate-[reveal_700ms_ease-out]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Audit Workspace
              </p>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
                {data?.name || "OWASP ASVS Checklist"}
              </h2>
              <p className="max-w-xl text-sm text-slate-600">
                Compact, data-heavy view for rapid auditing. Use quick filters
                and shortcuts to move faster.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Project: {data?.name || "Unnamed Project"}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Target Level: L{data?.targetLevel || 3}
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Last update:{" "}
                  {new Date(data?.date || new Date()).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Overall completion</span>
                <span>
                  {completedControls} / {totalControls}
                </span>
              </div>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{
                    width: `${totalControls > 0 ? (completedControls / totalControls) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Unanswered</span>
                <span className="font-semibold text-slate-900">
                  {unansweredControls}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-5 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur animate-[reveal_800ms_ease-out]">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Sections
            </div>
            <nav className="space-y-2 text-sm">
              {categoriesWithProgress.map((cat) => (
                <a
                  key={cat.shortcode}
                  href={`#${cat.shortcode}`}
                  className="block rounded-xl border border-slate-100 bg-white px-3 py-2 transition hover:border-orange-200"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {cat.shortcode}
                    </span>
                    <span className="text-xs text-slate-500">
                      {cat.progress.completed}/{cat.progress.total}
                    </span>
                  </div>
                  <div className="mt-2 h-1 w-full rounded-full bg-slate-200">
                    <div
                      className="h-1 rounded-full bg-emerald-500"
                      style={{
                        width: `${cat.progress.total > 0 ? (cat.progress.completed / cat.progress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{cat.name}</p>
                </a>
              ))}
            </nav>
          </aside>

          <main className="space-y-5 animate-[reveal_900ms_ease-out]">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Search
                    </label>
                    <input
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
                      placeholder="Search by shortcode, keyword, or tag"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    "All",
                    "Unanswered",
                    "Non-compliant",
                    "N/A",
                    "With notes",
                  ].map((label) => (
                    <button
                      key={label}
                      onClick={() => setActiveFilter(label)}
                      className={`rounded-full border px-3 py-2 font-semibold ${
                        activeFilter === label
                          ? "border-orange-300 bg-orange-50 text-orange-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {controls.map((requirement) =>
              requirement.Items.filter((cat) => cat.Items.length > 0).map(
                (category) => {
                  const catProgress = getCategoryProgress(category.Items);
                  let filteredItems = category.Items;

                  // Apply search filter
                  if (searchQuery) {
                    filteredItems = filteredItems.filter(
                      (item) =>
                        item.Shortcode.toLowerCase().includes(
                          searchQuery.toLowerCase(),
                        ) ||
                        item.Description.toLowerCase().includes(
                          searchQuery.toLowerCase(),
                        ),
                    );
                  }

                  // Apply status filter
                  if (activeFilter === "Unanswered") {
                    filteredItems = filteredItems.filter((item) => {
                      const res = findAuditRes(progress, item.Shortcode);
                      return res && !res.checked && !res.partial && !res.NA;
                    });
                  } else if (activeFilter === "Non-compliant") {
                    filteredItems = filteredItems.filter((item) => {
                      const res = findAuditRes(progress, item.Shortcode);
                      return res && !res.checked && !res.partial && !res.NA;
                    });
                  } else if (activeFilter === "N/A") {
                    filteredItems = filteredItems.filter((item) => {
                      const res = findAuditRes(progress, item.Shortcode);
                      return res && res.NA;
                    });
                  } else if (activeFilter === "With notes") {
                    filteredItems = filteredItems.filter((item) => {
                      const res = findAuditRes(progress, item.Shortcode);
                      return res && res.note && res.note.length > 0;
                    });
                  }

                  if (filteredItems.length === 0) return null;

                  return (
                    <section
                      key={category.Shortcode}
                      id={category.Shortcode}
                      className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            {category.Shortcode}
                          </p>
                          <h2 className="text-2xl font-semibold text-slate-900">
                            {category.Name}
                          </h2>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <button
                            onClick={() =>
                              handleBulkAction(category.Shortcode, "compliant")
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300"
                          >
                            Mark all compliant
                          </button>
                          <button
                            onClick={() =>
                              handleBulkAction(category.Shortcode, "na")
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300"
                          >
                            Mark all N/A
                          </button>
                          <button
                            onClick={() =>
                              handleBulkAction(category.Shortcode, "clear")
                            }
                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-2 bg-emerald-500"
                            style={{
                              width: `${catProgress.total > 0 ? (catProgress.completed / catProgress.total) * 100 : 0}%`,
                            }}
                          />
                        </div>
                        <span>
                          {catProgress.completed} / {catProgress.total}{" "}
                          completed
                        </span>
                      </div>

                      <div className="mt-4 space-y-2">
                        {filteredItems.map((item) => (
                          <ControlRow
                            key={item.Shortcode}
                            initialState={
                              progress.find(
                                (p) => p.shortcode === item.Shortcode,
                              )!
                            }
                            shortCode={item.Shortcode}
                            description={item.Description}
                            requiredFrom={getLevelLabel(item)}
                            handleStatusChange={handleStatusChange}
                            handleNote={(note) =>
                              handleNote(item.Shortcode, note)
                            }
                            cwe={(item as any).CWE}
                            nist={(item as any).NIST}
                          />
                        ))}
                      </div>
                    </section>
                  );
                },
              ),
            )}
          </main>
        </section>
      </div>
    </>
  );
}

export default Audit;
