// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
import SchemaBuilder from "@pothos/core";
import PrismaPlugin from "@pothos/plugin-prisma";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { /*createSchema,*/ createYoga } from "graphql-yoga";

import { prisma } from "@phac/db";

// Pothos Docs: https://pothos-graphql.dev/docs/guide

export const config = {
  api: {
    // Disable body parsing (required for file uploads)
    bodyParser: false,
  },
};

const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
    // defaults to false, uses /// comments from prisma schema as descriptions
    // for object types, relations and exposed fields.
    // descriptions can be omitted by setting description to false

    // exposeDescriptions: boolean | { models: boolean, fields: boolean },
    exposeDescriptions: { models: true, fields: true },

    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
  },
});

builder.prismaObject("organizations", {
  name: "organizations",
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name_en"),
  }),
});

builder.queryType({
  fields: (t) => ({
    hello: t.string({
      args: {
        name: t.arg.string(),
      },
      resolve: (parent, { name }) => `hello, ${name || "World"}`,
    }),
    countOrgs: t.int({
      description: "Name field",
      resolve: async () => prisma.organizations.count(),
    }),
    orgnames: t.stringList({
      description: "Name field",
      resolve: async () =>
        (await prisma.organizations.findMany()).map((o) => o.name_en),
    }),
    organizations: t.prismaField({
      type: ["organizations"],
      resolve: () => {
        return prisma.organizations.findMany({});
      },
    }),
  }),
});

const schema = builder.toSchema();

export default createYoga<{
  req: NextApiRequest;
  res: NextApiResponse;
}>({
  graphqlEndpoint: "/api/graphql",
  schema: schema,
});
