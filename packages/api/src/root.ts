import { authRouter } from "./router/auth";
import { organizationRouter } from "./router/organization";
import { personRouter } from "./router/person";
import { postRouter } from "./router/post";
import { statRouter } from "./router/stat";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  organization: organizationRouter,
  person: personRouter,
  post: postRouter,
  stat: statRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
