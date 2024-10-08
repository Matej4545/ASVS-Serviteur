import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import asvs from "../asvs_v4.0.3.json";
import { ASVSAuditResult } from "../types/types";

//Global
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//ASVS related

export function GetNumberOfActiveControls(controls: any) {
    return controls.flatMap((item: any) =>
        item.Items.flatMap((i: any) =>
          i.Items.map((i: any) => ({ Shortcode: i.Shortcode, Checked: false }))
        )
      ).length
}

export function getLevelLabel(item: any) {
  return item.L1.Required ? "L1" : item.L2.Required ? "L2" : "L3"
}

export function isRequiredForLevel(item: any, level: number)
{
  switch (level) {
    case 1:
      return item.L1.Required;
    case 2:
      return item.L2.Required;
    case 3:
      return item.L3.Required;
    default:
      return false;
  }
}

// Function used to replace md link into HTML link
const regex = /\(\[([\w|,|\ ]+)\]\((\S+)\)\)/gm;
export function replaceLink(description: string) {
  const textWithoutLink = description.replace(regex, "")
  const matchGroup = regex.exec(description)
  const linkText = matchGroup ? matchGroup[1] : null
  const link = matchGroup ? matchGroup[2] : null
  return { textWithoutLink, linkText, link}
}


export function filterAsvsByLevel(level: number) {
  return asvs.Requirements.map((req) => ({
    ...req,
    Items: req.Items.map((item) => ({
      ...item,
      Items: item.Items.filter((i) => isRequiredForLevel(i, level)),
    })),
  }));
}

export function getInitialResults() {
  return asvs.Requirements.flatMap((item) =>
    item.Items.flatMap((i) =>
      i.Items.map((i) => ({ shortcode: i.Shortcode, checked: false, note: "" } as ASVSAuditResult))
    )
  );
}
