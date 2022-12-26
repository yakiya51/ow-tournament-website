import Link from "next/link";
import { prisma } from "@server/db/client";
import type { InferGetServerSidePropsType } from "next";
import type { Tournament } from "@prisma/client";

export async function getServerSideProps() {
  const tournaments = await prisma.tournament.findMany({
    take: 5,
  });

  return {
    props: {
      tournaments: JSON.parse(JSON.stringify(tournaments)),
    },
  };
}

export default function Tournaments({
  tournaments,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container">
      <div className="mb-5 text-xl font-semibold text-neutral-400">
        Tournaments
      </div>
      <div className="flex flex-col">
        {tournaments &&
          tournaments.map((t: Tournament) => (
            <Link key={t.id} href={`/tournaments/${t.id}`}>
              <div className="flex w-full justify-between rounded border p-3 hover:border-neutral-100">
                <div className="flex w-full flex-col gap-y-2 overflow-hidden">
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold">
                    {t.title}
                  </div>
                  <div className="text-neutral-400">Open</div>
                </div>
                <div className="whitespace-nowrap text-sm text-neutral-400">
                  {new Date(t.start).toDateString()}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
