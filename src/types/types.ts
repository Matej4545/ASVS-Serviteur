export type ASVSAudit = {
  name: string;
  date: Date;
  targetLevel: number;
  results: ASVSAuditResult[];
};

export type ASVSAuditResult = {
  shortcode: string;
  checked: boolean;
  partial: boolean;
  NA: boolean;
  note: string | undefined;
};
