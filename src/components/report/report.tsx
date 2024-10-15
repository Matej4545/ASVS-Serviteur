import { ArrowLeftCircle, Check, Printer, TriangleAlert, X } from "lucide-react";
import { getLevelLabel, replaceLink } from "../../lib/helpers";
import { useLocalStorage } from "../../lib/localStorageProvider";
import {
  getPercent,
  getResultForCategories,
  getResultForLevel,
  getTotalScore,
} from "../../lib/reportHelpers";

function Report() {
  const { data } = useLocalStorage();

  if (!data)
    return (
      <div className="mx-auto items-center justify-center text-xl m-6 max-w-lg p-6 border flex gap-3 rounded-lg border-red-600">
        <TriangleAlert className="text-red-600" />
        <p>
          No data! First create a <a href="/">project</a>.
        </p>
      </div>
    );

  const results = getResultForLevel(data);
  const catResults = getResultForCategories(data);
  return (
    <div className="screen:px-8">
      <div className="print:hidden max-w-lg border border-orange-600 rounded-lg p-3 mb-8 text-center text-lg mx-auto">
        This is printable version of the OWASP ASVS report. You can print it to PDF for export.<div className="flex gap-3 place-content-between px-6 py-2"><a href="/" className="flex gap-2 justify-center w-fit items-center border rounded-md px-2 py-1 no-underline	text-black"><ArrowLeftCircle /> Go back </a><button onClick={() => window.print()} className="flex gap-2 justify-center  items-center border rounded-md px-2 py-1"> Print <Printer /></button></div>
      </div>
      <div id="report" className="screen:border screen:border-grey-100 screen:p-3 screen:rounded-lg">
      <div id="heading" className="pb-3">
        <div className="text-3xl pb-3">
          OWASP ASVS report | <span className="font-bold">{data.name}</span>
        </div>
        <table className="min-w-[30rem]">
          <thead>
            <tr>
              <th scope="col" className="w-32">
                Target level
              </th>
              <th scope="col">Audit date</th>
              <th scope="col" className="text-right">
                Score
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-center">L{data.targetLevel}</td>
              <td>{new Date(data.date).toDateString()}</td>
              <td className="text-right">
                {getTotalScore(results)} / {results.length} ({" "}
                {getPercent(getTotalScore(results), results.length)} %)
              </td>
            </tr>
          </tbody>
        </table>
        <h2>Summary per category</h2>
        <div className="grid grid-cols-4 gap-2">
          {catResults
            .filter(
              (cat) => cat.items.filter((cat) => cat.total != 0).length != 0
            )
            .flatMap((cat) => (
              <div className="shrink-0 grow-0 w-full">
                <div className="table w-full h-full">
                  <div className="p-1 border-b border-gray-400 w-full">
                    <span className="font-bold text-left">
                      {cat.shortcode}: {cat.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 text-center divide-y gap-y-1">
                    {cat.items
                      .filter((c) => c.total != 0)
                      .map((c) => (
                        <>
                          <span >{c.shortcode}</span>
                          <span className="col-span-2">
                            {c.checked} / {c.total} (
                            {getPercent(c.checked, c.total)} %)
                          </span>
                        </>
                      ))}
                  </div>
                  <div className="grow-0">
                    <td></td>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <h2>Details</h2>
      <table id="detail">
        <thead>
          <tr>
            <th>Shortcode</th>
            <th>Description</th>
            <th>Required from</th>
            <th>Satisfied</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr>
              <td className="w-24 text-center">{r.shortcode}</td>
              <td className="text-wrap max-w-md">
                {replaceLink(r.Description).textWithoutLink}
              </td>
              <td className="w-12 text-center">{getLevelLabel(r)}</td>
              <td className="w-12">
                {r.NA ? <p className="font-bold text-center w-full">N/A</p> : r.checked ? (
                  <Check className="text-green-600 mx-auto" />
                ) : (
                  <X className="text-red-600 mx-auto" />
                )}
              </td>
              <td className="text-wrap max-w-sm">{r.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>

  );
}

export default Report;
