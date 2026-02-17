import { NotebookPen } from "lucide-react";

const categories = [
  {
    shortcode: "V1",
    name: "Architecture, Design and Threat Modeling",
    progress: { checked: 14, total: 32 },
    controls: [
      {
        shortcode: "V1.1.1",
        description:
          "Use a documented secure architecture with clear trust boundaries and data flows.",
        level: "L1",
        status: "compliant",
        cwe: "CWE-1021",
        nist: "NIST 800-53",
        note: "Baseline docs exist; needs review before release.",
      },
      {
        shortcode: "V1.2.3",
        description:
          "Perform threat modeling for significant architectural changes.",
        level: "L2",
        status: "partial",
        cwe: "CWE-1030",
        nist: "NIST 800-53",
        note: "Model stored in repo; last update 3 months ago.",
      },
    ],
  },
  {
    shortcode: "V2",
    name: "Authentication",
    progress: { checked: 9, total: 18 },
    controls: [
      {
        shortcode: "V2.1.4",
        description:
          "Enforce MFA for privileged accounts and sensitive operations.",
        level: "L2",
        status: "noncompliant",
        cwe: "CWE-308",
        nist: "NIST 800-63",
        note: "Admin MFA rollout scheduled for Q2.",
      },
      {
        shortcode: "V2.2.7",
        description:
          "Use secure session management with short-lived access tokens.",
        level: "L1",
        status: "compliant",
        cwe: "CWE-613",
        nist: "NIST 800-63",
        note: "",
      },
    ],
  },
  {
    shortcode: "V3",
    name: "Session Management",
    progress: { checked: 11, total: 20 },
    controls: [
      {
        shortcode: "V3.3.2",
        description:
          "Invalidate sessions on password reset and account recovery.",
        level: "L2",
        status: "compliant",
        cwe: "CWE-613",
        nist: "NIST 800-63",
        note: "Implemented in identity service.",
      },
    ],
  },
];

const statusStyles: Record<string, string> = {
  compliant: "bg-emerald-500 text-white",
  noncompliant: "bg-rose-500 text-white",
  partial: "bg-amber-400 text-slate-900",
  na: "bg-slate-200 text-slate-700",
};

function TestPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-12 h-72 w-72 rounded-full bg-gradient-to-br from-orange-200 via-amber-100 to-transparent opacity-80 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-slate-200 via-white to-transparent opacity-70 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-8 2xl:max-w-[1440px] 2xl:px-10 3xl:max-w-none">
          <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between animate-[reveal_700ms_ease-out]">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Audit Workspace
              </p>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
                OWASP ASVS Checklist
              </h1>
              <p className="max-w-xl text-sm text-slate-600">
                Compact, data-heavy view for rapid auditing. Use quick filters
                and shortcuts to move faster.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Project: Orion Release
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Target Level: L2
                </span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1">
                  Last update: 2 hours ago
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Overall completion</span>
                <span>41 / 70</span>
              </div>
              <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full w-[59%] bg-gradient-to-r from-orange-500 to-amber-400" />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Unanswered</span>
                <span className="font-semibold text-slate-900">17</span>
              </div>
            </div>
          </header>

          <section className="mt-8 grid gap-5 lg:grid-cols-[220px_1fr] xl:grid-cols-[240px_1fr]">
            <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur animate-[reveal_800ms_ease-out]">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Sections
              </div>
              <nav className="space-y-2 text-sm">
                {categories.map((cat) => (
                  <div
                    key={cat.shortcode}
                    className="rounded-xl border border-slate-100 bg-white px-3 py-2 transition hover:border-orange-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {cat.shortcode}
                      </span>
                      <span className="text-xs text-slate-500">
                        {cat.progress.checked}/{cat.progress.total}
                      </span>
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-slate-200">
                      <div
                        className="h-1 rounded-full bg-emerald-500"
                        style={{
                          width: `${
                            (cat.progress.checked / cat.progress.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{cat.name}</p>
                  </div>
                ))}
              </nav>
              <div className="space-y-2 text-xs text-slate-500">
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="font-semibold text-slate-700">Shortcuts</p>
                  <p>1: Compliant | 2: Non-compliant | 3: N/A</p>
                  <p>N: Add note | F: Focus search</p>
                </div>
                <button className="w-full rounded-lg border border-slate-200 bg-white py-2 font-semibold text-slate-700 hover:border-orange-200">
                  Jump to next unfilled
                </button>
              </div>
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
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {categories.map((cat) => (
                <section
                  key={cat.shortcode}
                  className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                        {cat.shortcode}
                      </p>
                      <h2 className="text-2xl font-semibold text-slate-900">
                        {cat.name}
                      </h2>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300">
                        Mark all compliant
                      </button>
                      <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300">
                        Mark all N/A
                      </button>
                      <button className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-semibold text-slate-600 hover:border-orange-300">
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-3 text-xs text-slate-500">
                    <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-2 bg-emerald-500"
                        style={{
                          width: `${
                            (cat.progress.checked / cat.progress.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <span>
                      {cat.progress.checked} / {cat.progress.total} completed
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {cat.controls.map((control) =>
                      cat.shortcode === "V2" ? (
                        <div
                          key={control.shortcode}
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
                        >
                          <div className="grid gap-3 md:grid-cols-[40px_1fr_220px]">
                            <div className="font-mono text-xs font-semibold text-slate-700">
                              {control.shortcode}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm leading-snug text-slate-800">
                                {control.description}
                              </p>
                              <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                  {control.level}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                  {control.cwe}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                  {control.nist}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                  Status
                                </span>
                                <span
                                  className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                    statusStyles[control.status]
                                  }`}
                                >
                                  {control.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="grid flex-1 grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white text-[10px] font-semibold text-slate-600">
                                  {["Compliant", "Non", "Partial", "N/A"].map(
                                    (label) => (
                                      <button
                                        key={label}
                                        className="px-1 py-1 leading-tight text-center whitespace-normal hover:bg-slate-100"
                                      >
                                        {label}
                                      </button>
                                    ),
                                  )}
                                </div>
                                <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:border-orange-300">
                                  <NotebookPen size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          {control.note && (
                            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                Notes
                              </div>
                              <textarea
                                className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:border-orange-400 focus:outline-none"
                                defaultValue={control.note}
                              />
                              <div className="mt-2 flex items-center justify-end gap-2">
                                <button className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500">
                                  Cancel
                                </button>
                                <button className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div
                          key={control.shortcode}
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3"
                        >
                          <div className="grid gap-3 md:grid-cols-[70px_1fr_240px]">
                            <div className="font-mono text-xs font-semibold text-slate-700">
                              {control.shortcode}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm leading-snug text-slate-800">
                                {control.description}
                              </p>
                              <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                  {control.level}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                  {control.cwe}
                                </span>
                                <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5">
                                  {control.nist}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                  Status
                                </span>
                                <span
                                  className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                    statusStyles[control.status]
                                  }`}
                                >
                                  {control.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="grid flex-1 grid-cols-4 overflow-hidden rounded-xl border border-slate-200 bg-white text-[10px] font-semibold text-slate-600">
                                  {["Compliant", "Non", "Partial", "N/A"].map(
                                    (label) => (
                                      <button
                                        key={label}
                                        className="px-1 py-1 leading-tight text-center whitespace-normal hover:bg-slate-100"
                                      >
                                        {label}
                                      </button>
                                    ),
                                  )}
                                </div>
                                <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:border-orange-300">
                                  <NotebookPen size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                          {control.note && (
                            <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                Notes
                              </div>
                              <textarea
                                className="mt-2 h-24 w-full resize-none rounded-lg border border-slate-200 p-2 text-xs text-slate-700 focus:border-orange-400 focus:outline-none"
                                defaultValue={control.note}
                              />
                              <div className="mt-2 flex items-center justify-end gap-2">
                                <button className="rounded-md border border-slate-200 px-2 py-1 text-xs text-slate-500">
                                  Cancel
                                </button>
                                <button className="rounded-md bg-slate-900 px-2 py-1 text-xs font-semibold text-white">
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </main>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
