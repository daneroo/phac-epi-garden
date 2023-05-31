import { readFile } from "node:fs/promises";
import { faker } from "@faker-js/faker";
import { faker as fakerEN } from "@faker-js/faker/locale/en_CA";
import { faker as fakerFR } from "@faker-js/faker/locale/fr_CA";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

async function main() {
  // const modelNames /*: string[]*/ = [
  //   // "Post",
  //   // "diesel_schema_migrations",
  //   "organizations",
  //   "persons",
  //   "skills",
  //   "affiliations",
  //   "capabilities",
  //   "language_datas",
  //   "org_tiers",
  //   "org_tier_ownerships",
  //   "publications",
  //   "publication_contributors",
  //   "requirements",
  //   "teams",
  //   "team_ownerships",
  //   "roles",
  //   "tasks",
  //   "valid_roles",
  //   "validations",
  //   "users",
  //   "works",
  //   // "Account",
  //   // "Session",
  //   // "User",
  //   // "VerificationToken",
  // ];
  console.log("Seeding database");
  // or, if desiring a different locale
  // import { fakerDE as faker } from '@faker-js/faker';

  // Organizations
  const phacOrg = PHACOrg();
  const { id: phacId } = await prisma.organizations.create({
    data: phacOrg,
  });
  await prisma.organizations.createMany({
    data: scienceOrgs(),
  });

  // Org tiers
  const org_tiers = await readOrgTiers("./seed/org_structure.json");
  await makeTree(phacId, org_tiers);

  // Persons
  const persons = [];
  for (let i = 0; i < 1000; i++) {
    const person = getPerson(phacId);
    persons.push(person);
    // await prisma.persons.create({
    //   data: person,
    // });
  }
  console.log(`inserting ${persons.length} persons`);
  await prisma.persons.createMany({
    data: persons,
  });
}

function PHACOrg() {
  return {
    name_en: "Public Health Agency of Canada2",
    name_fr: "Agence de la santé publique du Canada2",
    acronym_en: "PHAC2",
    acronym_fr: "ASPC2",
    org_type: "Government",
    url: "some_url",
  };
}

function scienceOrgs() {
  return [
    { n: "British Columbia", ac: "UBC" },
    { n: "Manitoba", ac: "UM" },
    { n: "Toronto", ac: "UofT" },
    { n: "Quebec", ac: "UQAM" },
    { n: "Alberta", ac: "UofA" },
    { n: "Saskatchewan", ac: "USask" },
    { n: "New Brunswick", ac: "UNB" },
    { n: "Nova Scotia", ac: "NSCAD" },
  ].map(({ n: name, ac: acronym }) => {
    const org = {
      name_en: "University of " + name,
      name_fr: "Université de " + name,
      acronym_en: acronym,
      acronym_fr: acronym,
      org_type: "Academic",
      url: "some_url",
    };
    console.log(JSON.stringify(org));
    return org;
  });
}

/**
 * @param {string} orgId
 */
function getPerson(orgId) {
  // faker.helpers.weightedArrayElement<T>(array: readonly Array<{
  //   value: T,
  //   weight: number
  // }>): T
  // faker.helpers.weightedArrayElement([{ weight: 5, value: 'sunny' }, { weight: 4, value: 'rainy' }, { weight: 1, value: 'snowy' }]) // 'sunny', 50% of the time, 'rainy' 40% of the time, 'snowy' 10% of the time
  // could use weighted array
  const quarterFrench = fakerEN.number.int({ min: 0, max: 3 });
  const lang = quarterFrench == 3 ? "fr" : "en";
  const faker = lang === "fr" ? fakerFR : fakerEN;
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const email = faker.internet
    .email({
      firstName,
      lastName,
      provider: "phac-aspc.gc.ca",
    })
    .replace("@", faker.string.numeric(3) + "@");
  return {
    user_id: faker.string.uuid(),
    given_name: firstName,
    family_name: lastName,
    email,
    phone: faker.phone.number(),
    ...getWorkAddress(),
    // work_address: wa.work_address,
    // city: wa.city,
    // province: wa.province,
    // postal_code: wa.postal_code,
    organization_id: orgId,
    peoplesoft_id: faker.string.numeric(11),
    orcid_id: faker.string.numeric(11),
  };
}

function getWorkAddress() {
  // random work address from a list, instead of random addresses
  // return {
  //   work_address: faker.location.streetAddress(),
  //   city: faker.location.city(),
  //   province: faker.location.state(),
  //   postal_code: faker.location.zipCode(),
  //   country: "Canada",
  // };
  const addresses = [
    {
      work_address: "200 René Lévesque Blvd. West",
      city: "Montreal",
      province: "Quebec",
      postal_code: "H2Z 1X4",
      country: "Canada",
    },
    {
      work_address: "100 Colonnade Rd",
      city: "Ottawa",
      province: "Ontario",
      postal_code: "K2E 7J5",
      country: "Canada",
    },
    {
      work_address: "391 York Avenue",
      city: "Winnipeg",
      province: "Manitoba",
      postal_code: "R3C 4W1",
      country: "Canada",
    },
    {
      work_address: "180 Queen Street West",
      city: "Toronto",
      province: "Ontario",
      postal_code: "M5V 3L7",
      country: "Canada",
    },
  ];
  return faker.helpers.arrayElement(addresses);
}

/**
 * @typedef {Object} DataStructure
 * @property {string} division
 * @property {string} centre
 * @property {string} branch
 * @property {string} domain
 */

const DataStructure = z.object({
  division: z.string(),
  centre: z.string(),
  branch: z.string(),
  domain: z.string(),
});

/**
 * @param {import("fs").PathLike | import("fs/promises").FileHandle} filePath
 * @returns {Promise<z.infer<typeof DataStructure>[]>}
 */
async function readOrgTiers(filePath) {
  const data = await readFile(filePath, "utf-8");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const json = JSON.parse(data);

  // Validate data
  if (Array.isArray(json)) {
    json.forEach((item) => DataStructure.parse(item));
  } else {
    throw new Error("Invalid data format. Expected an array.");
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return json;
}

/**
 * @param {string} orgId
 * @param {{ division: string; centre: string; branch: string; domain: string; }[]} orgTiers
 */
async function makeTree(orgId, orgTiers) {
  // top level
  const topTier = await prisma.org_tiers.create({
    data: {
      organization_id: orgId,
      tier_level: 1,
      name_en:
        "Office of the President and Chief Public Health Officer (OPCPHO)",
      name_fr:
        "Office of the President and Chief Public Health Officer (OPCPHO)",
      primary_domain: "leadership",
      // parent_tier :        null for topTier
    },
  });
  console.log(`created top tier: ${topTier.id} ${topTier.name_en}`);

  /** @type {string[]} */
  const branches = makeUnique(orgTiers.map((item) => item.branch));
  for (const branch of branches) {
    console.log(`creating branch tier: ${branch}`);

    const orgTier = await prisma.org_tiers.create({
      data: {
        organization_id: orgId,
        tier_level: 2,
        name_en: branch,
        name_fr: branch,
        primary_domain: "leadership",
        parent_tier: topTier.id,
      },
    });
    console.log(`created branch tier: ${orgTier.id} ${orgTier.name_en}`);
  }

  const centres = makeUnique(orgTiers.map((item) => item.centre));

  const divisions = makeUnique(orgTiers.map((item) => item.division));

  // const domains = makeUnique(orgTiers.map((item) => item.domain));
}

/**
 * @param {Iterable<any> | null | undefined} listWithDuplicates
 */
function makeUnique(listWithDuplicates) {
  const uniqueList = [...new Set(listWithDuplicates)];
  return uniqueList;
}
main()
  .catch((e) => {
    console.log("Error", e);
  })
  .finally(() => {
    console.log("finally");
  });
