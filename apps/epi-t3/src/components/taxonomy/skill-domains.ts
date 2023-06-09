export type SkillDomains =
  | "public_health"
  | "scientific"
  | "medical"
  | "policy"
  | "human_resources"
  | "leadership"
  | "information_technology"
  | "communications"
  | "data"
  | "management"
  | "administration"
  | "partnerships"
  | "finance";

export type SkillDomain = {
  domain: SkillDomains;
  count: number;
};

// The counts here are from capabilities table in the database
// SELECT COUNT(*) AS count, "domain" FROM capabilities GROUP BY "domain" ORDER BY count DESC;
export const skillDomainsDistribution: SkillDomain[] = [
  { domain: "public_health", count: 4223 },
  { domain: "scientific", count: 2912 },
  { domain: "medical", count: 2268 },
  { domain: "policy", count: 2061 },
  { domain: "human_resources", count: 1107 },
  { domain: "leadership", count: 1089 },
  { domain: "information_technology", count: 1072 },
  { domain: "communications", count: 1052 },
  { domain: "data", count: 1033 },
  { domain: "management", count: 1011 },
  { domain: "administration", count: 994 },
  { domain: "partnerships", count: 987 },
  { domain: "finance", count: 986 },
];

export const skillDomains = skillDomainsDistribution.map((item) => item.domain);

export function getDomainOrder(domain: SkillDomains): number {
  const order = skillDomains.indexOf(domain);

  if (order === -1) {
    throw new Error(`Invalid domain: ${domain}`);
  }

  return order;
}

export type SkillDomainDistribution = {
  [domain in SkillDomains]: number;
};

export const skillDomainsDistributionObject: SkillDomainDistribution =
  skillDomainsDistribution.reduce((acc, skillDomain) => {
    acc[skillDomain.domain] = skillDomain.count;
    return acc;
  }, {} as SkillDomainDistribution);
