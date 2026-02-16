import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import asvs from "../data/OWASP_Application_Security_Verification_Standard_5.0.0_en.json";
import { ASVSAuditResult } from "../types/types";

//Global
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//ASVS related

export function getLevelLabel(item: any) {
  return `L${item.L}`;
}

export function isRequiredForLevel(item: any, level: number) {
  const itemLevel = parseInt(item.L);
  return itemLevel <= level;
}

// Function used to replace md link into HTML link
const regex = /\(\[([\w|,|\ ]+)\]\((\S+)\)\)/gm;
export function replaceLink(description: string) {
  const textWithoutLink = description.replace(regex, "");
  const matchGroup = regex.exec(description);
  const linkText = matchGroup ? matchGroup[1] : null;
  const link = matchGroup ? matchGroup[2] : null;
  return { textWithoutLink, linkText, link };
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
      i.Items.map(
        (i) =>
          ({
            shortcode: i.Shortcode,
            checked: false,
            NA: false,
            note: "",
          }) as ASVSAuditResult,
      ),
    ),
  );
}

export function findAuditRes(progress: ASVSAuditResult[], shortcode: string) {
  return progress.find((p) => p.shortcode === shortcode);
}
