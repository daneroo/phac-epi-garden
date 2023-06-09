export type CapabilityLevels =
  | "desired"
  | "novice"
  | "experienced"
  | "expert"
  | "specialist";

export type CapLevel = {
  level: CapabilityLevels;
  count: number;
};

// Distributional weight of the levels, was gotten from an initial seed
// This is also the source of truth for th ordering of the levels
export const capLevelsDistribution: CapLevel[] = [
  { level: "desired", count: 5398 },
  { level: "novice", count: 5950 },
  { level: "experienced", count: 6417 },
  { level: "expert", count: 2256 },
  { level: "specialist", count: 774 },
];

// The values of capability levels, it is complete, and ordered
export const capLevels = capLevelsDistribution.map((item) => item.level);

export function getLevelOrder(level: CapabilityLevels): number {
  const order = capLevels.indexOf(level);

  if (order === -1) {
    throw new Error(`Invalid level: ${level}`);
  }

  return order;
}

export type CapLevelDistribution = {
  [level in CapabilityLevels]: number;
};

// Create an object for quick lookup
export const capLevelsDistributionObject: CapLevelDistribution =
  capLevelsDistribution.reduce((acc, capLevel) => {
    acc[capLevel.level] = capLevel.count;
    return acc;
  }, {} as CapLevelDistribution);
