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

export const domainCodes: { [domain in SkillDomains]: string } = {
  public_health: "PH",
  scientific: "SCI",
  medical: "MED",
  policy: "POL",
  human_resources: "HR",
  leadership: "LEAD",
  information_technology: "IT",
  communications: "COMM",
  data: "DATA",
  management: "MGT",
  administration: "ADMIN",
  partnerships: "PART",
  finance: "FIN",
};

export type Skill = {
  domain: SkillDomains;
  name_en: string;
  count: number;
};

// Use the combined domain,skills (distribution from capabilities table)
// SELECT domain, name_en, COUNT(*) as count FROM capabilities GROUP BY domain, name_en order by count desc
// could order by domain,count desc.. or domain asc, name_en asc
// SELECT domain, name_en, COUNT(*) as count FROM capabilities GROUP BY domain, name_en order by domain asc,count desc
export const skillsDistribution: Skill[] = [
  { domain: "scientific", name_en: "Genomics", count: 602 },
  { domain: "scientific", name_en: "Anti-Microbial Resistance", count: 589 },
  { domain: "scientific", name_en: "Modelling", count: 584 },
  { domain: "scientific", name_en: "Climate Change", count: 581 },
  { domain: "scientific", name_en: "Whole Genome Sequencing", count: 556 },
  { domain: "public_health", name_en: "Community Health", count: 456 },
  { domain: "public_health", name_en: "Risk Assessment", count: 444 },
  { domain: "public_health", name_en: "Mental Health", count: 432 },
  { domain: "public_health", name_en: "Health Inequalities", count: 427 },
  { domain: "public_health", name_en: "Surveillance", count: 425 },
  { domain: "public_health", name_en: "Vaccines", count: 424 },
  { domain: "public_health", name_en: "Drug Use", count: 419 },
  { domain: "public_health", name_en: "One Health", count: 407 },
  {
    domain: "public_health",
    name_en: "Multi-sectoral Partnerships",
    count: 403,
  },
  { domain: "public_health", name_en: "Epidemiology", count: 386 },
  { domain: "medical", name_en: "Dental Health", count: 340 },
  { domain: "medical", name_en: "Nutrition", count: 337 },
  { domain: "medical", name_en: "Maternal Health", count: 336 },
  { domain: "medical", name_en: "Pediatrics", count: 323 },
  { domain: "medical", name_en: "Respiratory Health", count: 317 },
  { domain: "policy", name_en: "Governance", count: 311 },
  { domain: "medical", name_en: "Cardiovascular Health", count: 308 },
  { domain: "medical", name_en: "Chronic Disease", count: 307 },
  { domain: "policy", name_en: "Policy Implementation", count: 304 },
  { domain: "policy", name_en: "Evaluation", count: 301 },
  { domain: "policy", name_en: "Strategic Policy", count: 297 },
  { domain: "policy", name_en: "Policy Development", count: 288 },
  { domain: "policy", name_en: "MC & TBsub Writing", count: 287 },
  { domain: "human_resources", name_en: "Pay and Compensation", count: 279 },
  { domain: "human_resources", name_en: "Recruiting", count: 277 },
  { domain: "human_resources", name_en: "Classification", count: 276 },
  { domain: "human_resources", name_en: "Staffing", count: 275 },
  { domain: "management", name_en: "Action Management", count: 274 },
  { domain: "policy", name_en: "Policy Measurement", count: 273 },
  { domain: "communications", name_en: "Storytelling", count: 272 },
  { domain: "communications", name_en: "Writing", count: 269 },
  // { domain: "partnerships", name_en:
  // Continuing from the previous set of data...
  { domain: "communications", name_en: "Storytelling", count: 272 },
  { domain: "communications", name_en: "Writing", count: 269 },
  {
    domain: "partnerships",
    name_en: "Cross-sectoral Partnerships",
    count: 265,
  },
  { domain: "finance", name_en: "Accounting", count: 258 },
  { domain: "communications", name_en: "Media", count: 258 },
  {
    domain: "partnerships",
    name_en: "Inter-governmental Partnerships",
    count: 254,
  },
  { domain: "communications", name_en: "Public Speaking", count: 253 },
  { domain: "management", name_en: "Financial Management", count: 252 },
  { domain: "finance", name_en: "Government Budgeting", count: 247 },
  { domain: "finance", name_en: "Forecasting", count: 247 },
  { domain: "management", name_en: "People Management", count: 244 },
  { domain: "management", name_en: "Performance Management", count: 241 },
  { domain: "partnerships", name_en: "International Partnerships", count: 235 },
  { domain: "finance", name_en: "Audit", count: 234 },
  { domain: "partnerships", name_en: "Community Partnerships", count: 233 },
  { domain: "leadership", name_en: "Mobilizing People", count: 231 },
  { domain: "administration", name_en: "Operations", count: 223 },
  { domain: "leadership", name_en: "Vision Setting", count: 222 },
  { domain: "leadership", name_en: "Political Influence", count: 216 },
  { domain: "leadership", name_en: "Innovation", count: 215 },
  { domain: "administration", name_en: "HR Processing", count: 209 },
  { domain: "leadership", name_en: "Foresight", count: 205 },
  { domain: "administration", name_en: "Travel", count: 191 },
  { domain: "administration", name_en: "Budgeting", count: 190 },
  { domain: "administration", name_en: "ATIP", count: 181 },
  {
    domain: "information_technology",
    name_en: "Cloud Architecture",
    count: 176,
  },
  { domain: "data", name_en: "Public Health Infomatics", count: 169 },
  {
    domain: "information_technology",
    name_en: "Back-end Development",
    count: 162,
  },
  { domain: "information_technology", name_en: "Networking", count: 159 },
  { domain: "data", name_en: "Data Visualization", count: 157 },
  { domain: "data", name_en: "Data Collection", count: 153 },
  { domain: "data", name_en: "Data Management", count: 146 },
  {
    domain: "information_technology",
    name_en: "Cloud Administration",
    count: 146,
  },
  {
    domain: "information_technology",
    name_en: "Front-end Development",
    count: 144,
  },
  {
    domain: "information_technology",
    name_en: "Database Administration",
    count: 144,
  },
  {
    domain: "information_technology",
    name_en: "Programming - Python",
    count: 141,
  },
  { domain: "data", name_en: "Data Analysis", count: 139 },
  { domain: "data", name_en: "Data Access", count: 139 },
  { domain: "data", name_en: "Bioinfomatics", count: 130 },
];

export const skills = skillsDistribution.map((item) => ({
  domain: item.domain,
  name_en: item.name_en,
}));

export type SkillDistribution = {
  [key: string]: number;
};

// const map JSON.stringify({domain,name_en}) -> count
const skillDistributionObject: SkillDistribution = skillsDistribution.reduce(
  (acc, skill) => {
    const { domain, name_en } = skill;
    const key = JSON.stringify({ domain, name_en });
    acc[key] = skill.count;
    return acc;
  },
  {} as SkillDistribution,
);

export type SkillDomainDistribution = {
  [domain in SkillDomains]: { [name_en: string]: number };
};

export function getSkillCount(
  domain: SkillDomains,
  name_en: string,
): number | undefined {
  const key = JSON.stringify({ domain, name_en });
  const count = skillDistributionObject[key];
  return count;
}

export const skillDomainDistributionObject: SkillDomainDistribution =
  skillsDistribution.reduce((acc, skill) => {
    if (!acc[skill.domain]) {
      acc[skill.domain] = {};
    }
    acc[skill.domain][skill.name_en] = skill.count;
    return acc;
  }, {} as SkillDomainDistribution);

export const skillDomains: SkillDomains[] = Array.from(
  new Set(skillsDistribution.map((skill) => skill.domain)),
);

// Add a splash of color for domains return 'hsl()'
export function hslColorForDomain(domain: SkillDomains): string {
  const hueStep = 360 / skillDomains.length;
  const saturation = 100; // constant saturation for simplicity
  const lightness = 50; // works in dark and light modes
  const index = skillDomains.indexOf(domain);
  const hue = hueStep * index;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
