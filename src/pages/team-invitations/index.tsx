import { AlertCategory, useAlerts } from "@context/AlertsContext";
import type { Team, TeamInvitation } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";

export default function TeamInvitations({
  initialInvitations,
}: {
  initialInvitations: (TeamInvitation & { team: Team })[] | undefined;
}) {
  const alerts = useAlerts();

  const [teamInvitations, setTeamInvitations] = useState(initialInvitations);
  const getTeamInvitationsQuery = trpc.user.getTeamInvitations.useQuery();

  const refresh = async () => {
    alerts.add({
      message: "HELLO THIS IS A TEST",
      category: AlertCategory.SUCCESS,
    });
    const res = await getTeamInvitationsQuery.refetch();
    setTeamInvitations(res.data);
  };

  return (
    <div className="container">
      <div className="text-lg font-semibold text-neutral-500">
        Team Invitations
      </div>
      <button className="my-5" onClick={refresh}>
        REFRESH BUTTON
      </button>

      <div className="flex flex-col gap-y-3">
        {!teamInvitations ||
          (teamInvitations.length === 0 && (
            <div className="">No team invitations pending</div>
          ))}

        {teamInvitations &&
          teamInvitations.length > 0 &&
          teamInvitations.map((i) => (
            <div
              key={i.teamId + i.userId}
              className="flex justify-between border-b py-4 px-2"
            >
              <div className="">
                <div className="">{i.team.name}</div>
                <div className="text-sm text-neutral-400">Expires in 1 hr</div>
              </div>
              <div className="flex gap-x-5 ">
                <button className="">Accept</button>
                <button className="">Reject</button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { req } = ctx;
  const session = await getSession({ req });

  if (!session || !session.user) {
    return {
      redirect: { destination: "/" },
    };
  }

  const invitations = await prisma?.teamInvitation.findMany({
    where: {
      userId: session.user.id,
      resolved: false,
    },
    include: {
      team: true,
    },
  });

  return {
    props: {
      initialInvitations: JSON.parse(JSON.stringify(invitations)),
    },
  };
}
