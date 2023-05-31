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

  getChart: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const { id } = input;
      return ctx.prisma.org_tiers.findFirstOrThrow({
        where: !id
          ? {
              tier_level: 1,
            }
          : {
              id,
            },
        include: {
          other_org_tiers: {
            include: {
              org_tier_ownerships: true,
            },
          },
          org_tier_ownerships: {
            include: {
              persons: {
                include: {
                  roles: {
                    include: {
                      teams: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    }),

  getPersonsByOrgTier: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.org_tiers.findMany({
      include: {
        org_tier_ownerships: {
          include: {
            persons: {
              include: {
                roles: true,
              },
            },
          },
        },
      },
    });
  }),

  getPagedSearch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        search: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor, search } = input;
      const items = await ctx.prisma.persons.findMany({
        take: limit + 1,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          OR: [
            {
              given_name: {
                contains: search,
              },
            },
            {
              family_name: {
                contains: search,
              },
            },
            {
              email: {
                contains: search,
              },
            },
          ],
        },
        orderBy: [
          // family_name,given_name,id
          { family_name: "asc" },
          { given_name: "asc" },
          { id: "asc" },
        ],
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop(); // return the last item from the array
        nextCursor = nextItem?.id;
      }
      return {
        items,
        nextCursor,
      };
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
