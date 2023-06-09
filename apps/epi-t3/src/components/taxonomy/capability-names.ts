export type CapabilityNames =
  | "Genomics"
  | "Anti-Microbial Resistance"
  | "Modelling"
  | "Climate Change"
  | "Whole Genome Sequencing"
  | "Community Health"
  | "Risk Assessment"
  | "Mental Health"
  | "Health Inequalities"
  | "Surveillance"
  | "Vaccines"
  | "Drug Use"
  | "One Health"
  | "Multi-sectoral Partnerships"
  | "Epidemiology"
  | "Dental Health"
  | "Nutrition"
  | "Maternal Health"
  | "Pediatrics"
  | "Respiratory Health"
  | "Governance"
  | "Cardiovascular Health"
  | "Chronic Disease"
  | "Policy Implementation"
  | "Evaluation"
  | "Strategic Policy"
  | "Policy Development"
  | "MC & TBsub Writing"
  | "Pay and Compensation"
  | "Recruiting"
  | "Classification"
  | "Staffing"
  | "Action Management"
  | "Policy Measurement"
  | "Storytelling"
  | "Writing"
  | "Cross-sectoral Partnerships"
  | "Media"
  | "Accounting"
  | "Inter-governmental Partnerships"
  | "Public Speaking"
  | "Financial Management"
  | "Forecasting"
  | "Government Budgeting"
  | "People Management"
  | "Performance Management"
  | "International Partnerships"
  | "Audit"
  | "Community Partnerships"
  | "Mobilizing People"
  | "Operations"
  | "Vision Setting"
  | "Political Influence"
  | "Innovation"
  | "HR Processing"
  | "Foresight"
  | "Travel"
  | "Budgeting"
  | "ATIP"
  | "Cloud Architecture"
  | "Public Health Infomatics"
  | "Back-end Development"
  | "Networking"
  | "Data Visualization"
  | "Data Collection"
  | "Cloud Administration"
  | "Data Management"
  | "Front-end Development"
  | "Database Administration"
  | "Programming - Python"
  | "Data Access"
  | "Data Analysis"
  | "Bioinfomatics";

export type CapName = {
  name: CapabilityNames;
  count: number;
};

export const capNamesDistribution: CapName[] = [
  { name: "Genomics", count: 602 },
  { name: "Anti-Microbial Resistance", count: 589 },
  { name: "Modelling", count: 584 },
  { name: "Climate Change", count: 581 },
  { name: "Whole Genome Sequencing", count: 556 },
  { name: "Community Health", count: 456 },
  { name: "Risk Assessment", count: 444 },
  { name: "Mental Health", count: 432 },
  { name: "Health Inequalities", count: 427 },
  { name: "Surveillance", count: 425 },
  { name: "Vaccines", count: 424 },
  { name: "Drug Use", count: 419 },
  { name: "One Health", count: 407 },
  { name: "Multi-sectoral Partnerships", count: 403 },
  { name: "Epidemiology", count: 386 },
  { name: "Dental Health", count: 340 },
  { name: "Nutrition", count: 337 },
  { name: "Maternal Health", count: 336 },
  { name: "Pediatrics", count: 323 },
  { name: "Respiratory Health", count: 317 },
  { name: "Governance", count: 311 },
  { name: "Cardiovascular Health", count: 308 },
  { name: "Chronic Disease", count: 307 },
  { name: "Policy Implementation", count: 304 },
  { name: "Evaluation", count: 301 },
  { name: "Strategic Policy", count: 297 },
  { name: "Policy Development", count: 288 },
  { name: "MC & TBsub Writing", count: 287 },
  { name: "Pay and Compensation", count: 279 },
  { name: "Recruiting", count: 277 },
  { name: "Classification", count: 276 },
  { name: "Staffing", count: 275 },
  { name: "Action Management", count: 274 },
  { name: "Policy Measurement", count: 273 },
  { name: "Storytelling", count: 272 },
  { name: "Writing", count: 269 },
  { name: "Cross-sectoral Partnerships", count: 265 },
  { name: "Media", count: 258 },
  { name: "Accounting", count: 258 },
  { name: "Inter-governmental Partnerships", count: 254 },
  { name: "Public Speaking", count: 253 },
  { name: "Financial Management", count: 252 },
  { name: "Forecasting", count: 247 },
  { name: "Government Budgeting", count: 247 },
  { name: "People Management", count: 244 },
  { name: "Performance Management", count: 241 },
  { name: "International Partnerships", count: 235 },
  { name: "Audit", count: 234 },
  { name: "Community Partnerships", count: 233 },
  { name: "Mobilizing People", count: 231 },
  { name: "Operations", count: 223 },
  { name: "Vision Setting", count: 222 },
  { name: "Political Influence", count: 216 },
  { name: "Innovation", count: 215 },
  { name: "HR Processing", count: 209 },
  { name: "Foresight", count: 205 },
  { name: "Travel", count: 191 },
  { name: "Budgeting", count: 190 },
  { name: "ATIP", count: 181 },
  { name: "Cloud Architecture", count: 176 },
  { name: "Public Health Infomatics", count: 169 },
  { name: "Back-end Development", count: 162 },
  { name: "Networking", count: 159 },
  { name: "Data Visualization", count: 157 },
  { name: "Data Collection", count: 153 },
  { name: "Cloud Administration", count: 146 },
  { name: "Data Management", count: 146 },
  { name: "Front-end Development", count: 144 },
  { name: "Database Administration", count: 144 },
  { name: "Programming - Python", count: 141 },
  { name: "Data Access", count: 139 },
  { name: "Data Analysis", count: 139 },
  { name: "Bioinfomatics", count: 130 },
];

export const capNames = capNamesDistribution.map((item) => item.name);

export function getCapabilityOrder(name: CapabilityNames): number {
  const order = capNames.indexOf(name);

  if (order === -1) {
    throw new Error(`Invalid capability name: ${name}`);
  }

  return order;
}

export type CapNameDistribution = {
  [name in CapabilityNames]: number;
};

// Create an object for quick lookup
export const capNamesDistributionObject: CapNameDistribution =
  capNamesDistribution.reduce((acc, capName) => {
    acc[capName.name] = capName.count;
    return acc;
  }, {} as CapNameDistribution);
