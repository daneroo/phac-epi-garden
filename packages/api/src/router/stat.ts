// import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

interface CountMap {
  [key: string]: number;
}
export const statRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const countMap: CountMap = {
      organizations: await ctx.prisma.organizations.count(),
      org_tiers: await ctx.prisma.org_tiers.count(),
      persons: await ctx.prisma.persons.count(),
      capabilities: await ctx.prisma.capabilities.count(),
      affiliations: await ctx.prisma.affiliations.count(),
      publications: await ctx.prisma.publications.count(),
      publication_contributors:
        await ctx.prisma.publication_contributors.count(),
      requirements: await ctx.prisma.requirements.count(),
      roles: await ctx.prisma.roles.count(),
      skills: await ctx.prisma.skills.count(),
      tasks: await ctx.prisma.tasks.count(),
      teams: await ctx.prisma.teams.count(),
      valid_roles: await ctx.prisma.valid_roles.count(),
      validations: await ctx.prisma.validations.count(),
      works: await ctx.prisma.works.count(),
    };

    // Get the keys of the countMap and map over them
    const keys: (keyof CountMap)[] = Object.keys(
      countMap,
    ) as (keyof CountMap)[];

    // turn countMap into an array
    return keys.map((key) => {
      return {
        name: key,
        count: countMap[key] as number,
      };
    });
  }),
});
