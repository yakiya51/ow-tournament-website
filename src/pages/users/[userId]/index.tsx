import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import Error from "next/error";
import { prisma } from "@server/db/client";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const userId = ctx.params?.userId as string;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      asTeamMember: true,
    },
  });

  return {
    props: {
      user,
    },
  };
}

export default function UserDetail(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user } = props;

  if (!user) {
    return <Error statusCode={404} />;
  }

  return (
    <div className="container">
      <div className="text-xl text-neutral-100">{user.name}</div>
      <div className="text text-neutral-400">
        Joined {user.createdAt.toDateString()}
      </div>
    </div>
  );
}
