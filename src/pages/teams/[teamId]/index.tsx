import Modal from "@components/Modal";
import PlayerInvite from "@components/PlayerInvite";
import type { TeamMember, User } from "@prisma/client";
import { prisma } from "@server/db/client";
import type { GetServerSidePropsContext } from "next";
import { useState } from "react";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { teamId } = ctx.params as { teamId: string };

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
    },
    select: {
      name: true,
      createdAt: true,
      members: {
        select: {
          createdAt: true,
          user: true,
        },
      },
    },
  });

  if (!team) {
    return { notFound: true };
  }

  return {
    props: {
      team: JSON.parse(JSON.stringify(team)),
    },
  };
}

export default function TeamDetail({
  team,
}: {
  team: {
    members: (TeamMember & {
      user: User;
    })[];
    name: string;
    createdAt: Date;
  };
}) {
  const [showPlayerInviteModal, setShowPlayerInviteModal] = useState(false);

  return (
    <>
      <Modal
        show={showPlayerInviteModal}
        hide={() => setShowPlayerInviteModal(false)}
      >
        <PlayerInvite></PlayerInvite>
      </Modal>
      <div className="container">
        <div className="mb-10">
          <div className="mb-1 text-2xl font-semibold text-neutral-100">
            {team.name}
          </div>
          <div className="text-sm text-neutral-500">
            Created {new Date(team.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => setShowPlayerInviteModal(!showPlayerInviteModal)}
            className="ml-auto rounded bg-neutral-100 px-3 py-2 text-neutral-900"
          >
            Invite Player
          </button>
        </div>

        <div className="my-5">
          {team.members.map((member) => (
            <div
              className="flex items-center justify-between py-3"
              key={member.user.id}
            >
              <div className="col-span-1 ">
                <div className="text-xl font-semibold">{member.user.name}</div>
              </div>
              <div className="col-span-1">
                <div className="">
                  {new Date(member.createdAt).toDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
