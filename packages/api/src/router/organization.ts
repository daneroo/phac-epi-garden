import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const organizationRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.organizations.findMany({
      orderBy: [
        // sort by descending count of related org_tiers
        {
          org_tiers: {
            _count: "desc",
          },
        },
        // secondary sort criteria - for stability
        { id: "desc" },
      ],
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.organizations.findFirst({
        where: { id: input.id },
        include: {
          org_tiers: true,
        },
      });
    }),
});
