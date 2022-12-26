import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";

export default function Tournament({
  tournament,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <div className="container">{tournament}</div>;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      tournament: null,
    },
  };
};
