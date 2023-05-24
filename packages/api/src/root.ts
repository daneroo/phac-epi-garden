import { authRouter } from "./router/auth";
import { organizationRouter } from "./router/organization";
import { postRouter } from "./router/post";
import { statRouter } from "./router/stat";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  organization: organizationRouter,
  post: postRouter,
  stat: statRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
