import { ASVSAudit } from "../types/types";
import { filterAsvsByLevel, findAuditRes } from "./helpers";

export function getResultForLevel(data: ASVSAudit) {
  const controlsForLevel = filterAsvsByLevel(data.targetLevel);
  return controlsForLevel.flatMap((i1) =>
    i1.Items.flatMap((i2) =>
      i2.Items.map((i3) => ({
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
  console.log({enriched})
  return enriched
}

export function getPercent(checked: number, total: number) {
  return (checked / total * 100).toFixed(1)
}