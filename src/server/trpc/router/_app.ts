import { router } from "../trpc";
import { teamRouter } from "./team";
import { teamInvitationRouter } from "./teamInvitation";
import { userRouter } from "./user";

export const appRouter = router({
  user: userRouter,
  team: teamRouter,
  teamInvitation: teamInvitationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
