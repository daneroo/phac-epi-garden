import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

const skillCriteriaSchema = z.array(
  z.object({
    domain: z.string(),
    name_en: z.string(),
  }),
);

// because I can't infer from Prisma.where.. Object
// This is the type for a single skill: domain,name_en criteria
interface PrimaSkillCriteria {
  capabilities: {
    some: {
      AND: Array<Record<string, string>>;
    };
  };
}

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

  getSkillSearchCount: publicProcedure
    .input(
      z.object({
        skills: skillCriteriaSchema.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { skills } = input;
      const parsedCriteria = skillCriteriaSchema.parse(skills);

      // transform parsedCriteria to Prisma OR array
      const prismaCriteria: PrimaSkillCriteria[] = parsedCriteria.map(
        ({ domain, name_en }) => ({
          capabilities: {
            some: {
              AND: [{ domain: domain, name_en: name_en }],
            },
          },
        }),
      );

      const where = {
        AND: prismaCriteria,
      };
      const count = await ctx.prisma.persons.count({
        // conditionally include the where clause only if there are any skill criteria
        ...(skills && skills.length > 0 ? { where: where } : {}), // where: where,
      });

      return {
        count,
      };
    }),

  getPagedSkillSearch: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.string().nullish(),
        skip: z.number().optional(),
        skills: skillCriteriaSchema.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit, skip, cursor, skills } = input;
      const parsedCriteria = skillCriteriaSchema.parse(skills);

      // transform parsedCriteria to Prisma OR array
      const prismaCriteria: PrimaSkillCriteria[] = parsedCriteria.map(
        ({ domain, name_en }) => ({
          capabilities: {
            some: {
              AND: [{ domain: domain, name_en: name_en }],
            },
          },
        }),
      );

      const where = {
        AND: prismaCriteria,
      };
      const items = await ctx.prisma.persons.findMany({
        take: limit + 1,
        skip,
        cursor: cursor ? { id: cursor } : undefined,
        // conditionally include the where clause only if there are any skill criteria
        ...(skills && skills.length > 0 ? { where: where } : {}), // where: where,
        include: {
          capabilities: true,
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
