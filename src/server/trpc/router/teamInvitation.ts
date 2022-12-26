import { protectedProcedure, router } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const teamInvitationRouter = router({
  decline: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;
      const invitation = await prisma.teamInvitation.findFirst({
        where: {
          teamId: input,
          userId: session.user.id,
          resolved: false,
        },
        include: {
          team: {
            include: {
              members: true,
            },
          },
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No invitation found.",
        });
      }

      return prisma.teamInvitation.delete({
        where: {
          teamId_userId: { teamId: input, userId: session.user.id },
        },
      });
    }),

  accept: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;

      if (session.user.team !== null) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already on a team.",
        });
      }

      const invitation = await prisma.teamInvitation.findFirst({
        where: {
          teamId: input,
          userId: session.user.id,
          resolved: false,
        },
        include: {
          team: {
            include: {
              members: true,
            },
          },
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "No invitation found.",
        });
      }

      if (invitation.team.members.length >= 5) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Team already has 5 players.",
        });
      }

      await prisma.teamInvitation.delete({
        where: {
          teamId_userId: { teamId: input, userId: session.user.id },
        },
      });

      return prisma.teamMember.create({
        data: {
          teamId: input,
          userId: session.user.id,
          isLeader: false,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { session, prisma } = ctx;

      const count = await prisma.teamMember.count({
        where: {
          teamId: input.teamId,
          userId: session.user.id,
          isLeader: true,
        },
      });

      if (count === 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message:
            "User does not have permission to invite players onto this team.",
        });
      }

      const memberCount = await prisma.teamMember.count({
        where: {
          teamId: input.teamId,
        },
      });

      if (memberCount === 5) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "There are already 5 members on this team.",
        });
      }

      return prisma.teamInvitation.create({
        data: {
          teamId: input.teamId,
          userId: input.userId,
        },
      });
    }),
});
