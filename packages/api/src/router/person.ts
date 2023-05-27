import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const personRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.persons.findMany({
      orderBy: [
        // family_name,given_name,id
        { family_name: "asc" },
        { given_name: "asc" },
        { id: "asc" },
      ],
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.persons.findFirst({
        where: { id: input.id },
        include: {
          roles: true,
          capabilities: true,
        },
      });
    }),
});
