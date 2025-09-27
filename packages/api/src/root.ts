import { authRouter } from "./router/auth";
import { mailRouter } from "./router/mail";
import { postRouter } from "./router/post";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  post: postRouter,
  mail: mailRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
