export const inquiryStatuses = ["pending", "in_progress", "completed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  pending: "Offen",
  in_progress: "In Bearbeitung",
  completed: "Erledigt",
};

export const isInquiryStatus = (value: string): value is InquiryStatus =>
  inquiryStatuses.some((status) => status === value);