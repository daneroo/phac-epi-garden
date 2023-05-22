import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { statRouter } from "./router/stat";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  stat: statRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
