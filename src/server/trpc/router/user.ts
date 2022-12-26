import { protectedProcedure, publicProcedure, router } from "@server/trpc/trpc";
import { z } from "zod";

export const userRouter = router({
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input,
      },
      include: {
        asTeamMember: {
          include: {
            team: true,
          },
        },
      },
    });
  }),

  getByBattleTag: protectedProcedure
    .input(z.string().min(1))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findMany({
        where: {
          name: {
            startsWith: input,
          },
        },
        include: {
          teamInvitations: true,
        },
      });
    }),

  getMyTeam: protectedProcedure.query(({ ctx }) => {
    const { session, prisma } = ctx;

    return prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        asTeamMember: true,
      },
    });
  }),

  getTeamInvitations: protectedProcedure.query(({ ctx }) => {
    const { session, prisma } = ctx;

    return prisma.teamInvitation.findMany({
      where: {
        userId: session.user.id,
        resolved: false,
      },
      include: {
        team: true,
      },
    });
  }),
});
