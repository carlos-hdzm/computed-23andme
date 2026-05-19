export const versionValues = ["v5.2", "v5.9", "v7.0"] as const;
export const confidenceValues = {
    "v5.2" : [50, 60, 70, 80, 90] as const,
    "v5.9" : [50, 60, 70, 80, 90] as const,
    "v7.0" : ['mostLikely', 50, 60, 70, 80, 90] as const,
}

export const versionLabels: Record<(typeof versionValues)[number], string> = {
  "v5.2": "Version 5.2",
  "v5.9": "Version 5.9",
  "v7.0": "Version 7.0",
};

export const confidenceLabels: Record<
  (typeof confidenceValues)['v7.0'][number],
  string
> = {
  mostLikely: "Most Likely",
  50: "50% Confidence",
  60: "60% Confidence",
  70: "70% Confidence",
  80: "80% Confidence",
  90: "90% Confidence",
};
