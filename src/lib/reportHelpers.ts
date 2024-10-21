import { ASVSAudit } from "../types/types";
import { filterAsvsByLevel, findAuditRes } from "./helpers";

export function getResultForLevel(data: ASVSAudit) {
  const controlsForLevel = filterAsvsByLevel(data.targetLevel);
  return controlsForLevel.flatMap((i1) =>
    i1.Items.flatMap((i2) =>
      i2.Items.filter(i3 => !findAuditRes(data.results, i3.Shortcode)!.NA).map((i3) => ({
        ...i3,
        ...findAuditRes(data.results, i3.Shortcode),
      }))
    )
  );
}

export function getTotalScore(data: any[]) {
  return data.filter((d) => d.checked && !d.NA).length;
}

export function getResultForCategories(data: ASVSAudit) {
  const controlsForLevel = filterAsvsByLevel(data.targetLevel);
  const enriched = controlsForLevel.map((i1) => ({
    shortcode: i1.Shortcode,
    name: i1.ShortName,
    items: i1.Items.map((i2) => ({
      shortcode: i2.Shortcode,
      checked: i2.Items.filter(i3 => !findAuditRes(data.results, i3.Shortcode)!.NA).reduce(
        (acc, i3) =>
          findAuditRes(data.results, i3.Shortcode)!.checked
            ? acc+=1
            : acc,
        0
      ),
      total: i2.Items.filter((i3) => !findAuditRes(data.results, i3.Shortcode)!.NA).length
    })),
  }));
  return enriched
}

export function getPercent(checked: number, total: number) {
  return (checked / total * 100).toFixed(1)
}

/***
 * Function will generate a percentage of checked controls for each ASVS category based on targeted level
 */
export function generateRadarChartData(result: ASVSAudit) {

  const filteredASVS = filterAsvsByLevel(result.targetLevel);
  const labels = filteredASVS.flatMap(c => c.ShortName)
  const resultsForCategory = getResultForCategories(result).map(r => r.items.reduce((acc, item) => {return {checked: acc.checked + item.checked, total: acc.total + item.total}}, {checked: 0, total: 0}));
  const chartData = resultsForCategory.map(r => r.total ? getPercent(r.checked, r.total) : 100)
  console.log(chartData)
  const data = {
    labels: labels,
    datasets: [
      {
        label: "% of checked controls",
        data: chartData,
        fill: true,
        backgroundColor: "rgba(240, 90, 34, 0.2)",
        borderColor: "rgb(240, 90, 34)",
        pointBackgroundColor: "rgb(240, 90, 34)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  };
  return data;
}

export function getColorForResult(checked: number, total: number) {
  const res = checked / total
  if (res < 0.2) return "text-red-800 font-bold";
  if (res <= 0.5) return "text-red-600 font-bold";
  if (res <= 0.75) return "text-amber-600 font-bold";
  if (res == 1) return "text-lime-700 font-bold";
  return "font-bold";  
}