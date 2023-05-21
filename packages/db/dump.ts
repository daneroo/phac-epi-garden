/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises; // Use the promise version of fs

const prisma = new PrismaClient({
  // log: ["query", "error", "warn"],
});

async function main() {
  const shouldRestore = process.argv.includes("--restore");
  // TODO:(daneroo) automatically order the table for restore dependencies
  // just hand tweaked these till the restore order dependencies wen away
  const modelNames: string[] = [
    // "Post",
    // "diesel_schema_migrations",
    "organizations",
    "persons",
    "skills",
    "affiliations",
    "capabilities",
    "language_datas",
    "org_tiers",
    "org_tier_ownerships",
    "publications",
    "publication_contributors",
    "requirements",
    "teams",
    "team_ownerships",
    "roles",
    "tasks",
    "valid_roles",
    "validations",
    "users",
    "works",
    // "Account",
    // "Session",
    // "User",
    // "VerificationToken",
  ];
  if (shouldRestore) {
    console.log("Restoring database");
    for (const modelName of modelNames) {
      console.log(`Restoring table ${modelName}`);
      const start = +new Date();
      const count = await restoreTable(modelName);
      const elapsed = ((+new Date() - start) / 1000).toFixed(1);
      console.log(
        `Restored table ${modelName.padStart(25, " ")} -  ${count
          .toString()
          .padStart(6, " ")} records in ${elapsed} seconds`,
      );
    }
  } else {
    console.log("Dumping database");
    for (const modelName of modelNames) {
      // console.log(`Dumping table ${modelName}`);
      const count = await dumpTable(modelName);
      console.log(
        `Dumped table ${modelName.padStart(25, " ")} -  ${count
          .toString()
          .padStart(6, " ")} records`,
      );
    }
  }
}

async function dumpTable(modelName: string): Promise<number> {
  const records = await prisma[modelName.toLowerCase()].findMany();
  await fs.writeFile(
    `seed-data/${modelName}.json`,
    JSON.stringify(
      records,
      // for capabilities: validation_values     BigInt[]
      (_, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    ),
  );
  return records.length;
}

async function restoreTable(modelName: string): Promise<number> {
  const records = JSON.parse(
    await fs.readFile(`seed-data/${modelName}.json`, "utf8"),
  );
  let count = 0;
  const start = +new Date();

  for (const record of records) {
    // if (modelName == "capabilities") {
    //   if (count < 3570) {
    //     count += 1;
    //     continue;
    //   }
    // }
    const where =
      modelName === "valid_roles" ? { role: record.role } : { id: record.id }; // Replace `id` with the unique identifier for your model
    await prisma[modelName.toLowerCase()].upsert({
      where,
      update: record,
      create: record,
    });
    count += 1;
    // progress
    if (count % 10 == 0) {
      const elapsed = (+new Date() - start) / 1000;
      const rate = count / elapsed;
      console.log(
        `restored ${count} of ${
          records.length
        } ${modelName} in ${elapsed.toFixed(1)}s (rate:${rate.toFixed(1)}/s)`,
      );
    }
  }
  return records.length;
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
