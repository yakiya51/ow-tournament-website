import { teamNameInputSchema } from "@components/NavBar/AuthedNavBar";
import { protectedProcedure, router } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamRouter = router({
  create: protectedProcedure
    .input(z.object({ name: teamNameInputSchema }))
    .mutation(({ ctx, input }) => {
      const { session, prisma } = ctx;

      if (session.user.team) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "User is already on a team. They must disband or leave thier current team before creating a new one.",
        });
      }

      // Return id of created team
      return prisma.team.create({
        data: {
          name: input.name,
          creatorId: session.user.id,
          members: { create: { userId: session.user.id, isLeader: true } },
        },
        select: {
          id: true,
        },
      });
    }),
});
